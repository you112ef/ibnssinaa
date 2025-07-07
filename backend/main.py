from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
import os
import json
from datetime import datetime
import asyncio
from typing import List, Dict, Any
import shutil

from models.sperm_analyzer import SpermAnalyzer
from models.data_processor import DataProcessor
from utils.file_handler import FileHandler
from utils.response_models import AnalysisResponse, AnalysisResult

app = FastAPI(
    title="Sperm Analyzer AI API",
    description="Advanced AI-powered sperm analysis system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/results", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize components
sperm_analyzer = SpermAnalyzer()
data_processor = DataProcessor()
file_handler = FileHandler()

@app.on_event("startup")
async def startup_event():
    """Initialize the AI model on startup"""
    await sperm_analyzer.initialize_model()
    print("🚀 Sperm Analyzer AI API is ready!")

@app.get("/")
async def root():
    return {"message": "Sperm Analyzer AI API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/upload", response_model=Dict[str, Any])
async def upload_file(file: UploadFile = File(...)):
    """
    Upload image or video file for analysis
    """
    try:
        # Validate file type
        if not file_handler.validate_file(file):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images and videos are supported.")
        
        # Save uploaded file
        file_path = await file_handler.save_upload(file)
        
        # Generate file metadata
        metadata = await file_handler.get_file_metadata(file_path)
        
        return {
            "success": True,
            "file_id": metadata["file_id"],
            "file_path": file_path,
            "file_type": metadata["file_type"],
            "file_size": metadata["file_size"],
            "upload_time": metadata["upload_time"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/api/analyze/{file_id}", response_model=AnalysisResponse)
async def analyze_file(file_id: str, background_tasks: BackgroundTasks):
    """
    Analyze uploaded file using YOLOv8 model
    """
    try:
        # Get file path from file_id
        file_path = file_handler.get_file_path(file_id)
        if not file_path or not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Determine file type
        file_type = file_handler.get_file_type(file_path)
        
        # Perform analysis
        if file_type == "image":
            analysis_result = await sperm_analyzer.analyze_image(file_path)
        elif file_type == "video":
            analysis_result = await sperm_analyzer.analyze_video(file_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Process and enhance results
        processed_results = data_processor.process_analysis_results(analysis_result)
        
        # Generate visualizations
        chart_paths = await data_processor.generate_charts(processed_results, file_id)
        
        # Save results to database/file
        result_id = await data_processor.save_results(file_id, processed_results, chart_paths)
        
        # Clean up original file in background
        background_tasks.add_task(file_handler.cleanup_file, file_path)
        
        return AnalysisResponse(
            success=True,
            result_id=result_id,
            file_id=file_id,
            analysis_type=file_type,
            results=processed_results,
            charts=chart_paths,
            analysis_time=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/results/{result_id}", response_model=AnalysisResult)
async def get_results(result_id: str):
    """
    Retrieve analysis results by ID
    """
    try:
        results = await data_processor.get_results(result_id)
        if not results:
            raise HTTPException(status_code=404, detail="Results not found")
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve results: {str(e)}")

@app.get("/api/charts/{result_id}")
async def get_charts(result_id: str):
    """
    Get chart data for visualization
    """
    try:
        chart_data = await data_processor.get_chart_data(result_id)
        if not chart_data:
            raise HTTPException(status_code=404, detail="Chart data not found")
        
        return chart_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve charts: {str(e)}")

@app.get("/api/export/chart/{result_id}")
async def export_chart(result_id: str, chart_type: str = "line"):
    """
    Export chart as image
    """
    try:
        chart_path = await data_processor.export_chart_image(result_id, chart_type)
        if not chart_path or not os.path.exists(chart_path):
            raise HTTPException(status_code=404, detail="Chart not found")
        
        return FileResponse(
            chart_path,
            media_type="image/png",
            filename=f"sperm_analysis_chart_{result_id}.png"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chart export failed: {str(e)}")

@app.get("/api/history")
async def get_analysis_history():
    """
    Get list of previous analyses
    """
    try:
        history = await data_processor.get_analysis_history()
        return {"success": True, "history": history}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")

@app.delete("/api/results/{result_id}")
async def delete_results(result_id: str):
    """
    Delete analysis results and associated files
    """
    try:
        success = await data_processor.delete_results(result_id)
        if not success:
            raise HTTPException(status_code=404, detail="Results not found")
        
        return {"success": True, "message": "Results deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )