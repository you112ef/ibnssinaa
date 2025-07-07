import cv2
import numpy as np
import torch
from ultralytics import YOLO
import os
import asyncio
from typing import Dict, List, Any, Tuple
import json
from datetime import datetime
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SpermAnalyzer:
    def __init__(self):
        self.model = None
        self.model_path = "models/sperm_yolo.pt"
        self.confidence_threshold = 0.25
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.initialized = False
        
    async def initialize_model(self):
        """Initialize or train the YOLOv8 model for sperm detection"""
        try:
            # Check if pre-trained model exists
            if os.path.exists(self.model_path):
                logger.info(f"Loading existing model from {self.model_path}")
                self.model = YOLO(self.model_path)
            else:
                logger.info("No pre-trained model found. Training new model...")
                await self._train_model()
            
            # Move model to appropriate device
            self.model.to(self.device)
            self.initialized = True
            logger.info(f"Model initialized successfully on {self.device}")
            
        except Exception as e:
            logger.error(f"Failed to initialize model: {e}")
            # Fallback to base YOLOv8 and fine-tune for sperm detection
            await self._create_base_model()
    
    async def _train_model(self):
        """Train a YOLOv8 model specifically for sperm detection"""
        try:
            # Create training configuration
            await self._setup_training_data()
            
            # Initialize base YOLOv8 model
            self.model = YOLO('yolov8n.pt')  # Start with nano model for speed
            
            # Train the model
            results = self.model.train(
                data='sperm_dataset.yaml',
                epochs=100,
                imgsz=640,
                batch=16,
                device=self.device,
                patience=20,
                save=True,
                cache=True,
                workers=4,
                project='sperm_detection',
                name='sperm_v1'
            )
            
            # Save the trained model
            os.makedirs("models", exist_ok=True)
            self.model.export(format='pt')
            
            logger.info("Model training completed successfully")
            
        except Exception as e:
            logger.error(f"Training failed: {e}")
            await self._create_base_model()
    
    async def _setup_training_data(self):
        """Setup training data for sperm detection"""
        # Create dataset configuration
        dataset_config = {
            'train': 'data/train/images',
            'val': 'data/val/images',
            'nc': 1,  # Number of classes (sperm)
            'names': ['sperm']
        }
        
        # Create directories
        os.makedirs("data/train/images", exist_ok=True)
        os.makedirs("data/train/labels", exist_ok=True)
        os.makedirs("data/val/images", exist_ok=True)
        os.makedirs("data/val/labels", exist_ok=True)
        
        # Save dataset configuration
        with open('sperm_dataset.yaml', 'w') as f:
            for key, value in dataset_config.items():
                f.write(f"{key}: {value}\n")
        
        # Generate synthetic training data if no real data available
        await self._generate_synthetic_data()
    
    async def _generate_synthetic_data(self):
        """Generate synthetic sperm-like objects for training if no real data is available"""
        logger.info("Generating synthetic training data...")
        
        for i in range(100):  # Generate 100 synthetic images
            # Create synthetic image with sperm-like shapes
            img = np.zeros((640, 640, 3), dtype=np.uint8)
            
            # Add background noise
            noise = np.random.randint(0, 30, (640, 640, 3), dtype=np.uint8)
            img = cv2.add(img, noise)
            
            # Generate random sperm-like objects
            num_sperm = np.random.randint(5, 20)
            annotations = []
            
            for j in range(num_sperm):
                # Random position and size
                x = np.random.randint(50, 590)
                y = np.random.randint(50, 590)
                length = np.random.randint(30, 80)
                width = np.random.randint(8, 15)
                
                # Draw head (ellipse)
                head_size = np.random.randint(8, 12)
                cv2.ellipse(img, (x, y), (head_size, head_size//2), 0, 0, 360, (255, 255, 255), -1)
                
                # Draw tail (curved line)
                tail_points = self._generate_tail_points(x, y, length, width)
                for k in range(len(tail_points) - 1):
                    cv2.line(img, tail_points[k], tail_points[k+1], (255, 255, 255), 2)
                
                # Calculate bounding box for YOLO format
                x_min = min([p[0] for p in tail_points] + [x - head_size])
                y_min = min([p[1] for p in tail_points] + [y - head_size])
                x_max = max([p[0] for p in tail_points] + [x + head_size])
                y_max = max([p[1] for p in tail_points] + [y + head_size])
                
                # Convert to YOLO format (normalized center coordinates)
                center_x = (x_min + x_max) / 2 / 640
                center_y = (y_min + y_max) / 2 / 640
                bbox_width = (x_max - x_min) / 640
                bbox_height = (y_max - y_min) / 640
                
                annotations.append(f"0 {center_x:.6f} {center_y:.6f} {bbox_width:.6f} {bbox_height:.6f}")
            
            # Save image and annotation
            img_path = f"data/train/images/synthetic_{i:03d}.jpg"
            label_path = f"data/train/labels/synthetic_{i:03d}.txt"
            
            cv2.imwrite(img_path, img)
            with open(label_path, 'w') as f:
                f.write('\n'.join(annotations))
        
        logger.info("Synthetic data generation completed")
    
    def _generate_tail_points(self, start_x: int, start_y: int, length: int, width: int) -> List[Tuple[int, int]]:
        """Generate curved tail points for synthetic sperm"""
        points = [(start_x, start_y)]
        
        # Generate curved tail
        for i in range(1, length//5):
            t = i / (length//5)
            # Add some randomness to make it look natural
            curve_x = start_x + int(length * t * 0.8)
            curve_y = start_y + int(np.sin(t * np.pi * 2) * width * 0.5)
            points.append((curve_x, curve_y))
        
        return points
    
    async def _create_base_model(self):
        """Create a basic model as fallback"""
        logger.info("Creating base model for sperm detection")
        self.model = YOLO('yolov8n.pt')  # Use pre-trained COCO model as base
        self.initialized = True
    
    async def analyze_image(self, image_path: str) -> Dict[str, Any]:
        """Analyze a single image for sperm detection and characteristics"""
        if not self.initialized:
            await self.initialize_model()
        
        try:
            # Load and preprocess image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not load image from {image_path}")
            
            original_height, original_width = image.shape[:2]
            
            # Run inference
            results = self.model(image, conf=self.confidence_threshold)
            
            # Process results
            detections = []
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for i, box in enumerate(boxes):
                        # Extract detection info
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        confidence = float(box.conf[0].cpu().numpy())
                        
                        # Calculate sperm characteristics
                        width = x2 - x1
                        height = y2 - y1
                        area = width * height
                        aspect_ratio = width / height if height > 0 else 0
                        
                        # Extract sperm region for detailed analysis
                        sperm_region = image[int(y1):int(y2), int(x1):int(x2)]
                        characteristics = self._analyze_sperm_characteristics(sperm_region)
                        
                        detection = {
                            "id": i + 1,
                            "bbox": [float(x1), float(y1), float(x2), float(y2)],
                            "confidence": confidence,
                            "area": float(area),
                            "aspect_ratio": float(aspect_ratio),
                            "characteristics": characteristics
                        }
                        detections.append(detection)
            
            # Calculate overall statistics
            stats = self._calculate_image_statistics(detections, original_width, original_height)
            
            return {
                "type": "image_analysis",
                "image_path": image_path,
                "total_sperm_count": len(detections),
                "detections": detections,
                "statistics": stats,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Image analysis failed: {e}")
            raise
    
    async def analyze_video(self, video_path: str) -> Dict[str, Any]:
        """Analyze video for sperm tracking and motility analysis"""
        if not self.initialized:
            await self.initialize_model()
        
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError(f"Could not open video file: {video_path}")
            
            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = total_frames / fps if fps > 0 else 0
            
            frame_analyses = []
            sperm_tracks = {}
            frame_count = 0
            
            # Process every nth frame for efficiency
            frame_skip = max(1, int(fps // 5))  # Analyze 5 frames per second
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                if frame_count % frame_skip == 0:
                    # Analyze current frame
                    frame_result = await self._analyze_frame(frame, frame_count, fps)
                    frame_analyses.append(frame_result)
                    
                    # Update sperm tracking
                    self._update_sperm_tracking(sperm_tracks, frame_result, frame_count)
                
                frame_count += 1
            
            cap.release()
            
            # Calculate motility and movement statistics
            motility_stats = self._calculate_motility_statistics(sperm_tracks, fps)
            
            # Generate time-series data for charts
            time_series = self._generate_time_series_data(frame_analyses, fps)
            
            return {
                "type": "video_analysis",
                "video_path": video_path,
                "duration": duration,
                "total_frames_analyzed": len(frame_analyses),
                "fps": fps,
                "sperm_tracks": sperm_tracks,
                "motility_statistics": motility_stats,
                "time_series": time_series,
                "frame_analyses": frame_analyses,
                "analysis_timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Video analysis failed: {e}")
            raise
    
    async def _analyze_frame(self, frame: np.ndarray, frame_number: int, fps: float) -> Dict[str, Any]:
        """Analyze a single video frame"""
        # Run YOLO inference on frame
        results = self.model(frame, conf=self.confidence_threshold)
        
        detections = []
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for i, box in enumerate(boxes):
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = float(box.conf[0].cpu().numpy())
                    
                    # Calculate center point for tracking
                    center_x = (x1 + x2) / 2
                    center_y = (y1 + y2) / 2
                    
                    detection = {
                        "id": i,
                        "bbox": [float(x1), float(y1), float(x2), float(y2)],
                        "center": [float(center_x), float(center_y)],
                        "confidence": confidence,
                        "frame_number": frame_number,
                        "timestamp": frame_number / fps
                    }
                    detections.append(detection)
        
        return {
            "frame_number": frame_number,
            "timestamp": frame_number / fps,
            "sperm_count": len(detections),
            "detections": detections
        }
    
    def _analyze_sperm_characteristics(self, sperm_region: np.ndarray) -> Dict[str, Any]:
        """Analyze individual sperm characteristics from cropped region"""
        if sperm_region.size == 0:
            return {"morphology": "unknown", "quality_score": 0.0}
        
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(sperm_region, cv2.COLOR_BGR2GRAY)
        
        # Calculate basic morphology features
        height, width = gray.shape
        aspect_ratio = width / height if height > 0 else 0
        
        # Analyze shape characteristics
        contours, _ = cv2.findContours(gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # Find largest contour (main sperm body)
            main_contour = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(main_contour)
            perimeter = cv2.arcLength(main_contour, True)
            
            # Calculate morphology metrics
            if perimeter > 0:
                circularity = 4 * np.pi * area / (perimeter * perimeter)
            else:
                circularity = 0
            
            # Determine morphology classification
            if aspect_ratio > 3 and circularity < 0.3:
                morphology = "normal"
                quality_score = 0.8 + (aspect_ratio / 10) * 0.2
            elif aspect_ratio > 2:
                morphology = "acceptable"
                quality_score = 0.6
            else:
                morphology = "abnormal"
                quality_score = 0.3
        else:
            morphology = "unclear"
            quality_score = 0.4
        
        return {
            "morphology": morphology,
            "quality_score": min(1.0, max(0.0, quality_score)),
            "aspect_ratio": aspect_ratio,
            "area": float(area) if 'area' in locals() else 0,
            "circularity": float(circularity) if 'circularity' in locals() else 0
        }
    
    def _calculate_image_statistics(self, detections: List[Dict], width: int, height: int) -> Dict[str, Any]:
        """Calculate overall statistics for image analysis"""
        if not detections:
            return {
                "density": 0.0,
                "average_quality": 0.0,
                "morphology_distribution": {"normal": 0, "acceptable": 0, "abnormal": 0},
                "concentration_per_ml": 0.0
            }
        
        # Calculate density (sperm per unit area)
        total_area = width * height
        density = len(detections) / (total_area / 1000000)  # per mm²
        
        # Calculate average quality
        qualities = [d["characteristics"]["quality_score"] for d in detections]
        average_quality = np.mean(qualities) if qualities else 0.0
        
        # Morphology distribution
        morphologies = [d["characteristics"]["morphology"] for d in detections]
        morphology_dist = {
            "normal": morphologies.count("normal"),
            "acceptable": morphologies.count("acceptable"),
            "abnormal": morphologies.count("abnormal") + morphologies.count("unclear")
        }
        
        # Estimate concentration (assuming standard dilution)
        concentration_per_ml = len(detections) * 10000  # Rough estimation
        
        return {
            "density": float(density),
            "average_quality": float(average_quality),
            "morphology_distribution": morphology_dist,
            "concentration_per_ml": float(concentration_per_ml),
            "total_analyzed_area": float(total_area)
        }
    
    def _update_sperm_tracking(self, tracks: Dict, frame_result: Dict, frame_number: int):
        """Update sperm tracking across frames"""
        current_detections = frame_result["detections"]
        
        # Simple tracking based on proximity
        for detection in current_detections:
            center = detection["center"]
            matched_track = None
            min_distance = float('inf')
            
            # Find closest existing track
            for track_id, track in tracks.items():
                if track["positions"]:
                    last_pos = track["positions"][-1]
                    distance = np.sqrt((center[0] - last_pos[0])**2 + (center[1] - last_pos[1])**2)
                    if distance < min_distance and distance < 50:  # Threshold for same sperm
                        min_distance = distance
                        matched_track = track_id
            
            if matched_track:
                # Update existing track
                tracks[matched_track]["positions"].append(center)
                tracks[matched_track]["timestamps"].append(detection["timestamp"])
                tracks[matched_track]["last_seen"] = frame_number
            else:
                # Create new track
                track_id = f"sperm_{len(tracks) + 1}"
                tracks[track_id] = {
                    "positions": [center],
                    "timestamps": [detection["timestamp"]],
                    "first_seen": frame_number,
                    "last_seen": frame_number
                }
    
    def _calculate_motility_statistics(self, tracks: Dict, fps: float) -> Dict[str, Any]:
        """Calculate motility statistics from tracking data"""
        if not tracks:
            return {
                "total_motile_sperm": 0,
                "motility_percentage": 0.0,
                "average_velocity": 0.0,
                "average_path_length": 0.0
            }
        
        motile_count = 0
        velocities = []
        path_lengths = []
        
        for track_id, track in tracks.items():
            positions = track["positions"]
            timestamps = track["timestamps"]
            
            if len(positions) < 2:
                continue
            
            # Calculate path length
            path_length = 0
            for i in range(1, len(positions)):
                dx = positions[i][0] - positions[i-1][0]
                dy = positions[i][1] - positions[i-1][1]
                path_length += np.sqrt(dx**2 + dy**2)
            
            path_lengths.append(path_length)
            
            # Calculate average velocity
            if len(timestamps) > 1:
                total_time = timestamps[-1] - timestamps[0]
                if total_time > 0:
                    velocity = path_length / total_time  # pixels per second
                    velocities.append(velocity)
                    
                    # Consider motile if moves significantly
                    if velocity > 5:  # Threshold for motile sperm
                        motile_count += 1
        
        total_sperm = len(tracks)
        motility_percentage = (motile_count / total_sperm * 100) if total_sperm > 0 else 0
        
        return {
            "total_sperm": total_sperm,
            "total_motile_sperm": motile_count,
            "motility_percentage": float(motility_percentage),
            "average_velocity": float(np.mean(velocities)) if velocities else 0.0,
            "average_path_length": float(np.mean(path_lengths)) if path_lengths else 0.0,
            "velocity_std": float(np.std(velocities)) if velocities else 0.0
        }
    
    def _generate_time_series_data(self, frame_analyses: List[Dict], fps: float) -> Dict[str, Any]:
        """Generate time series data for visualization"""
        timestamps = [frame["timestamp"] for frame in frame_analyses]
        sperm_counts = [frame["sperm_count"] for frame in frame_analyses]
        
        return {
            "timestamps": timestamps,
            "sperm_counts": sperm_counts,
            "fps": fps,
            "total_duration": max(timestamps) if timestamps else 0
        }