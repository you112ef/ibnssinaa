import os
import uuid
import hashlib
import aiofiles
from fastapi import UploadFile
from typing import Dict, Any, Optional
import logging
from datetime import datetime
import mimetypes
import magic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FileHandler:
    def __init__(self):
        self.upload_dir = "static/uploads"
        self.allowed_image_types = {
            'image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff'
        }
        self.allowed_video_types = {
            'video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/wmv'
        }
        self.max_file_size = 100 * 1024 * 1024  # 100MB
        self.file_registry = {}
        
        # Create upload directory
        os.makedirs(self.upload_dir, exist_ok=True)
    
    def validate_file(self, file: UploadFile) -> bool:
        """Validate uploaded file type and size"""
        try:
            # Check file size
            if hasattr(file, 'size') and file.size > self.max_file_size:
                logger.warning(f"File too large: {file.size} bytes")
                return False
            
            # Check MIME type
            content_type = file.content_type
            if not content_type:
                # Try to detect from filename
                content_type, _ = mimetypes.guess_type(file.filename)
            
            if content_type not in (self.allowed_image_types | self.allowed_video_types):
                logger.warning(f"Invalid content type: {content_type}")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"File validation failed: {e}")
            return False
    
    async def save_upload(self, file: UploadFile) -> str:
        """Save uploaded file and return file path"""
        try:
            # Generate unique filename
            file_extension = self._get_file_extension(file.filename)
            file_id = str(uuid.uuid4())
            filename = f"{file_id}{file_extension}"
            file_path = os.path.join(self.upload_dir, filename)
            
            # Save file
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            # Register file
            self.file_registry[file_id] = {
                "file_path": file_path,
                "original_name": file.filename,
                "upload_time": datetime.now().isoformat(),
                "size": len(content),
                "content_type": file.content_type
            }
            
            logger.info(f"File saved: {file_path}")
            return file_path
            
        except Exception as e:
            logger.error(f"Failed to save file: {e}")
            raise
    
    def _get_file_extension(self, filename: str) -> str:
        """Extract file extension from filename"""
        if filename and '.' in filename:
            return '.' + filename.rsplit('.', 1)[1].lower()
        return ''
    
    async def get_file_metadata(self, file_path: str) -> Dict[str, Any]:
        """Get metadata for a file"""
        try:
            # Find file in registry
            file_id = None
            for fid, data in self.file_registry.items():
                if data["file_path"] == file_path:
                    file_id = fid
                    break
            
            if not file_id:
                # Generate new file_id for existing file
                file_id = str(uuid.uuid4())
            
            # Get file stats
            stat = os.stat(file_path)
            file_size = stat.st_size
            
            # Detect file type
            file_type = self.get_file_type(file_path)
            
            # Calculate file hash for integrity
            file_hash = await self._calculate_file_hash(file_path)
            
            metadata = {
                "file_id": file_id,
                "file_type": file_type,
                "file_size": file_size,
                "file_hash": file_hash,
                "upload_time": datetime.now().isoformat()
            }
            
            # Update registry if new
            if file_id not in self.file_registry:
                self.file_registry[file_id] = {
                    "file_path": file_path,
                    "upload_time": metadata["upload_time"],
                    "size": file_size,
                    "content_type": self._get_mime_type(file_path)
                }
            
            return metadata
            
        except Exception as e:
            logger.error(f"Failed to get file metadata: {e}")
            raise
    
    async def _calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA-256 hash of file"""
        try:
            hasher = hashlib.sha256()
            async with aiofiles.open(file_path, 'rb') as f:
                while chunk := await f.read(8192):
                    hasher.update(chunk)
            return hasher.hexdigest()
        except Exception as e:
            logger.error(f"Failed to calculate file hash: {e}")
            return ""
    
    def get_file_type(self, file_path: str) -> str:
        """Determine if file is image or video"""
        try:
            mime_type = self._get_mime_type(file_path)
            
            if mime_type in self.allowed_image_types:
                return "image"
            elif mime_type in self.allowed_video_types:
                return "video"
            else:
                return "unknown"
                
        except Exception as e:
            logger.error(f"Failed to determine file type: {e}")
            return "unknown"
    
    def _get_mime_type(self, file_path: str) -> str:
        """Get MIME type of file"""
        try:
            # Try using python-magic for accurate detection
            try:
                mime_type = magic.from_file(file_path, mime=True)
                return mime_type
            except:
                # Fallback to mimetypes module
                mime_type, _ = mimetypes.guess_type(file_path)
                return mime_type or 'application/octet-stream'
                
        except Exception as e:
            logger.error(f"Failed to get MIME type: {e}")
            return 'application/octet-stream'
    
    def get_file_path(self, file_id: str) -> Optional[str]:
        """Get file path from file ID"""
        file_info = self.file_registry.get(file_id)
        if file_info:
            return file_info["file_path"]
        return None
    
    async def cleanup_file(self, file_path: str):
        """Clean up temporary file"""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                
                # Remove from registry
                file_id_to_remove = None
                for file_id, data in self.file_registry.items():
                    if data["file_path"] == file_path:
                        file_id_to_remove = file_id
                        break
                
                if file_id_to_remove:
                    del self.file_registry[file_id_to_remove]
                
                logger.info(f"Cleaned up file: {file_path}")
                
        except Exception as e:
            logger.error(f"Failed to cleanup file: {e}")
    
    def get_file_info(self, file_id: str) -> Optional[Dict[str, Any]]:
        """Get file information by ID"""
        return self.file_registry.get(file_id)
    
    def list_uploaded_files(self) -> Dict[str, Dict[str, Any]]:
        """List all uploaded files"""
        return self.file_registry.copy()
    
    async def validate_file_integrity(self, file_path: str, expected_hash: str) -> bool:
        """Validate file integrity using hash"""
        try:
            actual_hash = await self._calculate_file_hash(file_path)
            return actual_hash == expected_hash
        except Exception as e:
            logger.error(f"File integrity validation failed: {e}")
            return False
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage statistics"""
        try:
            total_files = len(self.file_registry)
            total_size = sum(data["size"] for data in self.file_registry.values())
            
            # Get disk usage
            statvfs = os.statvfs(self.upload_dir)
            free_space = statvfs.f_frsize * statvfs.f_bavail
            total_space = statvfs.f_frsize * statvfs.f_blocks
            
            return {
                "total_files": total_files,
                "total_size_bytes": total_size,
                "total_size_mb": total_size / (1024 * 1024),
                "free_space_bytes": free_space,
                "free_space_mb": free_space / (1024 * 1024),
                "total_space_bytes": total_space,
                "total_space_mb": total_space / (1024 * 1024),
                "upload_directory": self.upload_dir
            }
            
        except Exception as e:
            logger.error(f"Failed to get storage stats: {e}")
            return {}
    
    async def bulk_cleanup(self, max_age_hours: int = 24):
        """Clean up old uploaded files"""
        try:
            current_time = datetime.now()
            files_to_remove = []
            
            for file_id, data in self.file_registry.items():
                upload_time = datetime.fromisoformat(data["upload_time"])
                age_hours = (current_time - upload_time).total_seconds() / 3600
                
                if age_hours > max_age_hours:
                    files_to_remove.append((file_id, data["file_path"]))
            
            # Remove old files
            for file_id, file_path in files_to_remove:
                await self.cleanup_file(file_path)
            
            logger.info(f"Cleaned up {len(files_to_remove)} old files")
            return len(files_to_remove)
            
        except Exception as e:
            logger.error(f"Bulk cleanup failed: {e}")
            return 0