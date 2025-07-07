import json
import os
import uuid
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import seaborn as sns
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging
import asyncio

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self):
        self.results_dir = "static/results"
        self.charts_dir = "static/charts"
        self.data_file = "static/analysis_data.json"
        
        # Create directories
        os.makedirs(self.results_dir, exist_ok=True)
        os.makedirs(self.charts_dir, exist_ok=True)
        
        # Initialize data storage
        self._init_data_storage()
        
        # Configure matplotlib for better charts
        plt.style.use('seaborn-v0_8')
        sns.set_palette("husl")
    
    def _init_data_storage(self):
        """Initialize the data storage file if it doesn't exist"""
        if not os.path.exists(self.data_file):
            initial_data = {
                "analyses": [],
                "last_updated": datetime.now().isoformat()
            }
            with open(self.data_file, 'w') as f:
                json.dump(initial_data, f, indent=2)
    
    def process_analysis_results(self, raw_results: Dict[str, Any]) -> Dict[str, Any]:
        """Process and enhance raw analysis results"""
        try:
            processed = {
                "analysis_id": str(uuid.uuid4()),
                "type": raw_results.get("type", "unknown"),
                "timestamp": datetime.now().isoformat(),
                "raw_data": raw_results
            }
            
            if raw_results["type"] == "image_analysis":
                processed.update(self._process_image_results(raw_results))
            elif raw_results["type"] == "video_analysis":
                processed.update(self._process_video_results(raw_results))
            
            return processed
            
        except Exception as e:
            logger.error(f"Failed to process results: {e}")
            raise
    
    def _process_image_results(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Process image analysis results"""
        stats = results.get("statistics", {})
        detections = results.get("detections", [])
        
        # Calculate enhanced metrics
        quality_scores = [d["characteristics"]["quality_score"] for d in detections]
        morphologies = [d["characteristics"]["morphology"] for d in detections]
        
        processed = {
            "sperm_count": results.get("total_sperm_count", 0),
            "density": stats.get("density", 0.0),
            "concentration_per_ml": stats.get("concentration_per_ml", 0.0),
            "average_quality": stats.get("average_quality", 0.0),
            "quality_distribution": self._calculate_quality_distribution(quality_scores),
            "morphology_summary": self._calculate_morphology_summary(morphologies),
            "viability_assessment": self._assess_viability(stats),
            "clinical_interpretation": self._generate_clinical_interpretation(stats, len(detections))
        }
        
        return processed
    
    def _process_video_results(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Process video analysis results"""
        motility_stats = results.get("motility_statistics", {})
        time_series = results.get("time_series", {})
        
        processed = {
            "duration": results.get("duration", 0.0),
            "fps": results.get("fps", 0.0),
            "total_sperm": motility_stats.get("total_sperm", 0),
            "motile_sperm": motility_stats.get("total_motile_sperm", 0),
            "motility_percentage": motility_stats.get("motility_percentage", 0.0),
            "average_velocity": motility_stats.get("average_velocity", 0.0),
            "velocity_variation": motility_stats.get("velocity_std", 0.0),
            "movement_patterns": self._analyze_movement_patterns(results.get("sperm_tracks", {})),
            "temporal_analysis": self._analyze_temporal_patterns(time_series),
            "motility_classification": self._classify_motility(motility_stats),
            "clinical_interpretation": self._generate_motility_interpretation(motility_stats)
        }
        
        return processed
    
    def _calculate_quality_distribution(self, quality_scores: List[float]) -> Dict[str, Any]:
        """Calculate quality score distribution"""
        if not quality_scores:
            return {"excellent": 0, "good": 0, "fair": 0, "poor": 0}
        
        scores = np.array(quality_scores)
        return {
            "excellent": int(np.sum(scores >= 0.8)),
            "good": int(np.sum((scores >= 0.6) & (scores < 0.8))),
            "fair": int(np.sum((scores >= 0.4) & (scores < 0.6))),
            "poor": int(np.sum(scores < 0.4)),
            "average_score": float(np.mean(scores)),
            "std_deviation": float(np.std(scores))
        }
    
    def _calculate_morphology_summary(self, morphologies: List[str]) -> Dict[str, Any]:
        """Calculate morphology distribution summary"""
        total = len(morphologies)
        if total == 0:
            return {"normal_percentage": 0, "abnormal_percentage": 0, "total_assessed": 0}
        
        normal_count = morphologies.count("normal")
        acceptable_count = morphologies.count("acceptable")
        abnormal_count = total - normal_count - acceptable_count
        
        return {
            "normal_count": normal_count,
            "acceptable_count": acceptable_count,
            "abnormal_count": abnormal_count,
            "normal_percentage": (normal_count / total) * 100,
            "abnormal_percentage": (abnormal_count / total) * 100,
            "total_assessed": total
        }
    
    def _assess_viability(self, stats: Dict[str, Any]) -> Dict[str, Any]:
        """Assess overall sperm viability"""
        concentration = stats.get("concentration_per_ml", 0)
        quality = stats.get("average_quality", 0)
        
        # WHO reference values (simplified)
        normal_concentration = 15000000  # 15 million per ml
        
        viability_score = 0
        if concentration >= normal_concentration:
            viability_score += 40
        else:
            viability_score += (concentration / normal_concentration) * 40
        
        viability_score += quality * 60  # Quality contributes 60% to viability
        
        if viability_score >= 80:
            assessment = "Excellent"
        elif viability_score >= 60:
            assessment = "Good"
        elif viability_score >= 40:
            assessment = "Fair"
        else:
            assessment = "Poor"
        
        return {
            "viability_score": min(100, max(0, viability_score)),
            "assessment": assessment,
            "meets_who_standards": concentration >= normal_concentration and quality >= 0.6
        }
    
    def _analyze_movement_patterns(self, tracks: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze sperm movement patterns"""
        if not tracks:
            return {"linear_swimmers": 0, "circular_swimmers": 0, "erratic_swimmers": 0}
        
        linear_count = 0
        circular_count = 0
        erratic_count = 0
        
        for track_id, track in tracks.items():
            positions = track.get("positions", [])
            if len(positions) < 3:
                continue
            
            # Analyze movement pattern
            pattern = self._classify_movement_pattern(positions)
            if pattern == "linear":
                linear_count += 1
            elif pattern == "circular":
                circular_count += 1
            else:
                erratic_count += 1
        
        total = linear_count + circular_count + erratic_count
        return {
            "linear_swimmers": linear_count,
            "circular_swimmers": circular_count,
            "erratic_swimmers": erratic_count,
            "linear_percentage": (linear_count / total * 100) if total > 0 else 0,
            "total_tracked": total
        }
    
    def _classify_movement_pattern(self, positions: List[List[float]]) -> str:
        """Classify individual sperm movement pattern"""
        if len(positions) < 3:
            return "erratic"
        
        # Calculate displacement vectors
        displacements = []
        for i in range(1, len(positions)):
            dx = positions[i][0] - positions[i-1][0]
            dy = positions[i][1] - positions[i-1][1]
            displacements.append([dx, dy])
        
        # Calculate path straightness
        total_displacement = np.sqrt(
            (positions[-1][0] - positions[0][0])**2 + 
            (positions[-1][1] - positions[0][1])**2
        )
        
        path_length = sum(np.sqrt(d[0]**2 + d[1]**2) for d in displacements)
        
        if path_length > 0:
            straightness = total_displacement / path_length
            if straightness > 0.7:
                return "linear"
            elif straightness > 0.3:
                return "circular"
        
        return "erratic"
    
    def _analyze_temporal_patterns(self, time_series: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze temporal patterns in sperm count"""
        timestamps = time_series.get("timestamps", [])
        counts = time_series.get("sperm_counts", [])
        
        if len(counts) < 2:
            return {"stability": "insufficient_data", "trend": "unknown"}
        
        # Calculate stability metrics
        mean_count = np.mean(counts)
        std_count = np.std(counts)
        cv = (std_count / mean_count) * 100 if mean_count > 0 else 0
        
        # Determine stability
        if cv < 20:
            stability = "high"
        elif cv < 40:
            stability = "moderate"
        else:
            stability = "low"
        
        # Calculate trend
        if len(counts) > 5:
            trend_slope = np.polyfit(range(len(counts)), counts, 1)[0]
            if trend_slope > 0.5:
                trend = "increasing"
            elif trend_slope < -0.5:
                trend = "decreasing"
            else:
                trend = "stable"
        else:
            trend = "stable"
        
        return {
            "mean_count": float(mean_count),
            "coefficient_of_variation": float(cv),
            "stability": stability,
            "trend": trend,
            "max_count": int(max(counts)) if counts else 0,
            "min_count": int(min(counts)) if counts else 0
        }
    
    def _classify_motility(self, motility_stats: Dict[str, Any]) -> str:
        """Classify overall motility level"""
        motility_pct = motility_stats.get("motility_percentage", 0)
        
        if motility_pct >= 40:  # WHO normal reference
            return "normal"
        elif motility_pct >= 30:
            return "below_normal"
        elif motility_pct >= 20:
            return "low"
        else:
            return "very_low"
    
    def _generate_clinical_interpretation(self, stats: Dict[str, Any], sperm_count: int) -> str:
        """Generate clinical interpretation for image analysis"""
        concentration = stats.get("concentration_per_ml", 0)
        quality = stats.get("average_quality", 0)
        
        interpretations = []
        
        # Concentration assessment
        if concentration >= 15000000:
            interpretations.append("Normal sperm concentration (≥15M/ml)")
        elif concentration >= 10000000:
            interpretations.append("Slightly below normal concentration")
        else:
            interpretations.append("Low sperm concentration (oligozoospermia)")
        
        # Quality assessment
        if quality >= 0.8:
            interpretations.append("Excellent morphological quality")
        elif quality >= 0.6:
            interpretations.append("Good morphological quality")
        elif quality >= 0.4:
            interpretations.append("Fair morphological quality")
        else:
            interpretations.append("Poor morphological quality")
        
        return "; ".join(interpretations)
    
    def _generate_motility_interpretation(self, motility_stats: Dict[str, Any]) -> str:
        """Generate clinical interpretation for video analysis"""
        motility_pct = motility_stats.get("motility_percentage", 0)
        avg_velocity = motility_stats.get("average_velocity", 0)
        
        interpretations = []
        
        # Motility assessment
        if motility_pct >= 40:
            interpretations.append("Normal sperm motility (≥40%)")
        elif motility_pct >= 30:
            interpretations.append("Slightly reduced motility")
        else:
            interpretations.append("Reduced sperm motility (asthenozoospermia)")
        
        # Velocity assessment
        if avg_velocity >= 20:
            interpretations.append("Good swimming velocity")
        elif avg_velocity >= 10:
            interpretations.append("Moderate swimming velocity")
        else:
            interpretations.append("Low swimming velocity")
        
        return "; ".join(interpretations)
    
    async def generate_charts(self, processed_results: Dict[str, Any], file_id: str) -> Dict[str, str]:
        """Generate visualization charts for the results"""
        charts = {}
        chart_id = processed_results["analysis_id"]
        
        try:
            if processed_results["type"] == "image_analysis":
                charts.update(await self._generate_image_charts(processed_results, chart_id))
            elif processed_results["type"] == "video_analysis":
                charts.update(await self._generate_video_charts(processed_results, chart_id))
            
            return charts
            
        except Exception as e:
            logger.error(f"Chart generation failed: {e}")
            return {}
    
    async def _generate_image_charts(self, results: Dict[str, Any], chart_id: str) -> Dict[str, str]:
        """Generate charts for image analysis results"""
        charts = {}
        
        # 1. Quality Distribution Pie Chart
        quality_dist = results.get("quality_distribution", {})
        if any(quality_dist.values()):
            fig, ax = plt.subplots(figsize=(10, 8))
            
            labels = ["Excellent", "Good", "Fair", "Poor"]
            sizes = [quality_dist.get(k.lower(), 0) for k in labels]
            colors = ['#2ecc71', '#3498db', '#f39c12', '#e74c3c']
            
            wedges, texts, autotexts = ax.pie(sizes, labels=labels, colors=colors, 
                                            autopct='%1.1f%%', startangle=90)
            ax.set_title('Sperm Quality Distribution', fontsize=16, fontweight='bold')
            
            chart_path = f"{self.charts_dir}/quality_dist_{chart_id}.png"
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            charts["quality_distribution"] = chart_path
        
        # 2. Morphology Bar Chart
        morphology = results.get("morphology_summary", {})
        if morphology.get("total_assessed", 0) > 0:
            fig, ax = plt.subplots(figsize=(10, 6))
            
            categories = ["Normal", "Acceptable", "Abnormal"]
            counts = [
                morphology.get("normal_count", 0),
                morphology.get("acceptable_count", 0),
                morphology.get("abnormal_count", 0)
            ]
            colors = ['#2ecc71', '#f39c12', '#e74c3c']
            
            bars = ax.bar(categories, counts, color=colors)
            ax.set_title('Sperm Morphology Analysis', fontsize=16, fontweight='bold')
            ax.set_ylabel('Count')
            
            # Add value labels on bars
            for bar, count in zip(bars, counts):
                height = bar.get_height()
                ax.annotate(f'{count}',
                           xy=(bar.get_x() + bar.get_width() / 2, height),
                           xytext=(0, 3),  # 3 points vertical offset
                           textcoords="offset points",
                           ha='center', va='bottom')
            
            chart_path = f"{self.charts_dir}/morphology_{chart_id}.png"
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            charts["morphology"] = chart_path
        
        return charts
    
    async def _generate_video_charts(self, results: Dict[str, Any], chart_id: str) -> Dict[str, str]:
        """Generate charts for video analysis results"""
        charts = {}
        
        # 1. Sperm Count Over Time (Line Chart)
        temporal_analysis = results.get("temporal_analysis", {})
        raw_data = results.get("raw_data", {})
        time_series = raw_data.get("time_series", {})
        
        if time_series.get("timestamps") and time_series.get("sperm_counts"):
            fig, ax = plt.subplots(figsize=(12, 6))
            
            timestamps = time_series["timestamps"]
            counts = time_series["sperm_counts"]
            
            ax.plot(timestamps, counts, linewidth=2, color='#3498db', marker='o', markersize=4)
            ax.fill_between(timestamps, counts, alpha=0.3, color='#3498db')
            
            ax.set_title('Sperm Count Over Time', fontsize=16, fontweight='bold')
            ax.set_xlabel('Time (seconds)')
            ax.set_ylabel('Sperm Count')
            ax.grid(True, alpha=0.3)
            
            chart_path = f"{self.charts_dir}/time_series_{chart_id}.png"
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            charts["time_series"] = chart_path
        
        # 2. Motility Statistics Bar Chart
        if results.get("motile_sperm") is not None:
            fig, ax = plt.subplots(figsize=(10, 6))
            
            total_sperm = results.get("total_sperm", 0)
            motile_sperm = results.get("motile_sperm", 0)
            non_motile = total_sperm - motile_sperm
            
            categories = ["Motile", "Non-Motile"]
            counts = [motile_sperm, non_motile]
            colors = ['#2ecc71', '#e74c3c']
            
            bars = ax.bar(categories, counts, color=colors)
            ax.set_title('Sperm Motility Analysis', fontsize=16, fontweight='bold')
            ax.set_ylabel('Count')
            
            # Add percentage labels
            for bar, count in zip(bars, counts):
                percentage = (count / total_sperm * 100) if total_sperm > 0 else 0
                height = bar.get_height()
                ax.annotate(f'{count}\n({percentage:.1f}%)',
                           xy=(bar.get_x() + bar.get_width() / 2, height),
                           xytext=(0, 3),
                           textcoords="offset points",
                           ha='center', va='bottom')
            
            chart_path = f"{self.charts_dir}/motility_{chart_id}.png"
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            charts["motility"] = chart_path
        
        # 3. Movement Patterns Pie Chart
        movement_patterns = results.get("movement_patterns", {})
        if movement_patterns.get("total_tracked", 0) > 0:
            fig, ax = plt.subplots(figsize=(10, 8))
            
            labels = ["Linear", "Circular", "Erratic"]
            sizes = [
                movement_patterns.get("linear_swimmers", 0),
                movement_patterns.get("circular_swimmers", 0),
                movement_patterns.get("erratic_swimmers", 0)
            ]
            colors = ['#2ecc71', '#3498db', '#e74c3c']
            
            wedges, texts, autotexts = ax.pie(sizes, labels=labels, colors=colors,
                                            autopct='%1.1f%%', startangle=90)
            ax.set_title('Sperm Movement Patterns', fontsize=16, fontweight='bold')
            
            chart_path = f"{self.charts_dir}/movement_patterns_{chart_id}.png"
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            charts["movement_patterns"] = chart_path
        
        return charts
    
    async def save_results(self, file_id: str, processed_results: Dict[str, Any], 
                          chart_paths: Dict[str, str]) -> str:
        """Save analysis results to storage"""
        try:
            result_id = processed_results["analysis_id"]
            
            # Prepare complete result data
            complete_result = {
                "result_id": result_id,
                "file_id": file_id,
                "processed_results": processed_results,
                "chart_paths": chart_paths,
                "created_at": datetime.now().isoformat()
            }
            
            # Save individual result file
            result_file = f"{self.results_dir}/result_{result_id}.json"
            with open(result_file, 'w') as f:
                json.dump(complete_result, f, indent=2)
            
            # Update main data file
            await self._update_main_data_file(complete_result)
            
            return result_id
            
        except Exception as e:
            logger.error(f"Failed to save results: {e}")
            raise
    
    async def _update_main_data_file(self, result_data: Dict[str, Any]):
        """Update the main data file with new results"""
        try:
            # Read existing data
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            
            # Add new analysis
            data["analyses"].append({
                "result_id": result_data["result_id"],
                "file_id": result_data["file_id"],
                "type": result_data["processed_results"]["type"],
                "timestamp": result_data["created_at"],
                "summary": self._create_result_summary(result_data["processed_results"])
            })
            
            # Keep only last 100 analyses
            data["analyses"] = data["analyses"][-100:]
            data["last_updated"] = datetime.now().isoformat()
            
            # Write back to file
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            logger.error(f"Failed to update main data file: {e}")
    
    def _create_result_summary(self, processed_results: Dict[str, Any]) -> Dict[str, Any]:
        """Create a summary of results for quick access"""
        if processed_results["type"] == "image_analysis":
            return {
                "sperm_count": processed_results.get("sperm_count", 0),
                "average_quality": processed_results.get("average_quality", 0),
                "viability_score": processed_results.get("viability_assessment", {}).get("viability_score", 0)
            }
        elif processed_results["type"] == "video_analysis":
            return {
                "total_sperm": processed_results.get("total_sperm", 0),
                "motility_percentage": processed_results.get("motility_percentage", 0),
                "average_velocity": processed_results.get("average_velocity", 0)
            }
        
        return {}
    
    async def get_results(self, result_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve analysis results by ID"""
        try:
            result_file = f"{self.results_dir}/result_{result_id}.json"
            if os.path.exists(result_file):
                with open(result_file, 'r') as f:
                    return json.load(f)
            return None
            
        except Exception as e:
            logger.error(f"Failed to retrieve results: {e}")
            return None
    
    async def get_chart_data(self, result_id: str) -> Optional[Dict[str, Any]]:
        """Get chart data for visualization"""
        try:
            results = await self.get_results(result_id)
            if not results:
                return None
            
            processed = results["processed_results"]
            chart_paths = results["chart_paths"]
            
            # Prepare chart data for frontend
            chart_data = {
                "result_id": result_id,
                "analysis_type": processed["type"],
                "charts": {}
            }
            
            # Add chart URLs
            for chart_type, path in chart_paths.items():
                if os.path.exists(path):
                    # Convert to relative URL
                    chart_data["charts"][chart_type] = path.replace("static/", "/static/")
            
            # Add raw data for interactive charts
            if processed["type"] == "video_analysis":
                raw_data = processed.get("raw_data", {})
                time_series = raw_data.get("time_series", {})
                chart_data["time_series_data"] = {
                    "timestamps": time_series.get("timestamps", []),
                    "sperm_counts": time_series.get("sperm_counts", [])
                }
            
            return chart_data
            
        except Exception as e:
            logger.error(f"Failed to get chart data: {e}")
            return None
    
    async def export_chart_image(self, result_id: str, chart_type: str) -> Optional[str]:
        """Export chart as downloadable image"""
        try:
            results = await self.get_results(result_id)
            if not results:
                return None
            
            chart_paths = results["chart_paths"]
            chart_path = chart_paths.get(chart_type)
            
            if chart_path and os.path.exists(chart_path):
                return chart_path
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to export chart: {e}")
            return None
    
    async def get_analysis_history(self) -> List[Dict[str, Any]]:
        """Get list of previous analyses"""
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            
            # Return analyses in reverse chronological order
            analyses = data.get("analyses", [])
            return sorted(analyses, key=lambda x: x["timestamp"], reverse=True)
            
        except Exception as e:
            logger.error(f"Failed to retrieve history: {e}")
            return []
    
    async def delete_results(self, result_id: str) -> bool:
        """Delete analysis results and associated files"""
        try:
            # Delete result file
            result_file = f"{self.results_dir}/result_{result_id}.json"
            if os.path.exists(result_file):
                os.remove(result_file)
            
            # Delete chart files
            chart_files = [
                f"{self.charts_dir}/quality_dist_{result_id}.png",
                f"{self.charts_dir}/morphology_{result_id}.png",
                f"{self.charts_dir}/time_series_{result_id}.png",
                f"{self.charts_dir}/motility_{result_id}.png",
                f"{self.charts_dir}/movement_patterns_{result_id}.png"
            ]
            
            for chart_file in chart_files:
                if os.path.exists(chart_file):
                    os.remove(chart_file)
            
            # Remove from main data file
            await self._remove_from_main_data_file(result_id)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete results: {e}")
            return False
    
    async def _remove_from_main_data_file(self, result_id: str):
        """Remove result from main data file"""
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            
            # Remove the analysis
            data["analyses"] = [a for a in data["analyses"] if a["result_id"] != result_id]
            data["last_updated"] = datetime.now().isoformat()
            
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            logger.error(f"Failed to remove from main data file: {e}")