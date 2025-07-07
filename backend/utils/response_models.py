from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime

class SpermDetection(BaseModel):
    id: int
    bbox: List[float] = Field(description="Bounding box coordinates [x1, y1, x2, y2]")
    confidence: float = Field(ge=0.0, le=1.0, description="Detection confidence score")
    area: float = Field(ge=0.0, description="Area of detected sperm")
    aspect_ratio: float = Field(ge=0.0, description="Aspect ratio of bounding box")
    characteristics: Dict[str, Any] = Field(description="Sperm morphology characteristics")

class ImageStatistics(BaseModel):
    density: float = Field(ge=0.0, description="Sperm density per unit area")
    average_quality: float = Field(ge=0.0, le=1.0, description="Average quality score")
    morphology_distribution: Dict[str, int] = Field(description="Distribution of morphology types")
    concentration_per_ml: float = Field(ge=0.0, description="Estimated concentration per ml")
    total_analyzed_area: float = Field(ge=0.0, description="Total analyzed area in pixels")

class QualityDistribution(BaseModel):
    excellent: int = Field(ge=0, description="Number of excellent quality sperm")
    good: int = Field(ge=0, description="Number of good quality sperm")
    fair: int = Field(ge=0, description="Number of fair quality sperm")
    poor: int = Field(ge=0, description="Number of poor quality sperm")
    average_score: float = Field(ge=0.0, le=1.0, description="Average quality score")
    std_deviation: float = Field(ge=0.0, description="Standard deviation of quality scores")

class MorphologySummary(BaseModel):
    normal_count: int = Field(ge=0, description="Number of normal morphology sperm")
    acceptable_count: int = Field(ge=0, description="Number of acceptable morphology sperm")
    abnormal_count: int = Field(ge=0, description="Number of abnormal morphology sperm")
    normal_percentage: float = Field(ge=0.0, le=100.0, description="Percentage of normal sperm")
    abnormal_percentage: float = Field(ge=0.0, le=100.0, description="Percentage of abnormal sperm")
    total_assessed: int = Field(ge=0, description="Total number of sperm assessed")

class ViabilityAssessment(BaseModel):
    viability_score: float = Field(ge=0.0, le=100.0, description="Overall viability score")
    assessment: str = Field(description="Viability assessment category")
    meets_who_standards: bool = Field(description="Whether sample meets WHO standards")

class MotilityStatistics(BaseModel):
    total_sperm: int = Field(ge=0, description="Total number of tracked sperm")
    total_motile_sperm: int = Field(ge=0, description="Number of motile sperm")
    motility_percentage: float = Field(ge=0.0, le=100.0, description="Percentage of motile sperm")
    average_velocity: float = Field(ge=0.0, description="Average swimming velocity")
    average_path_length: float = Field(ge=0.0, description="Average path length")
    velocity_std: float = Field(ge=0.0, description="Standard deviation of velocities")

class MovementPatterns(BaseModel):
    linear_swimmers: int = Field(ge=0, description="Number of linear swimming sperm")
    circular_swimmers: int = Field(ge=0, description="Number of circular swimming sperm")
    erratic_swimmers: int = Field(ge=0, description="Number of erratic swimming sperm")
    linear_percentage: float = Field(ge=0.0, le=100.0, description="Percentage of linear swimmers")
    total_tracked: int = Field(ge=0, description="Total number of tracked sperm")

class TemporalAnalysis(BaseModel):
    mean_count: float = Field(ge=0.0, description="Mean sperm count over time")
    coefficient_of_variation: float = Field(ge=0.0, description="Coefficient of variation")
    stability: str = Field(description="Stability classification")
    trend: str = Field(description="Temporal trend")
    max_count: int = Field(ge=0, description="Maximum count observed")
    min_count: int = Field(ge=0, description="Minimum count observed")

class TimeSeriesData(BaseModel):
    timestamps: List[float] = Field(description="Time points in seconds")
    sperm_counts: List[int] = Field(description="Sperm counts at each time point")
    fps: float = Field(gt=0.0, description="Frames per second of source video")
    total_duration: float = Field(ge=0.0, description="Total duration in seconds")

class ImageAnalysisResult(BaseModel):
    sperm_count: int = Field(ge=0, description="Total number of detected sperm")
    density: float = Field(ge=0.0, description="Sperm density")
    concentration_per_ml: float = Field(ge=0.0, description="Concentration per ml")
    average_quality: float = Field(ge=0.0, le=1.0, description="Average quality score")
    quality_distribution: QualityDistribution
    morphology_summary: MorphologySummary
    viability_assessment: ViabilityAssessment
    clinical_interpretation: str = Field(description="Clinical interpretation text")

class VideoAnalysisResult(BaseModel):
    duration: float = Field(ge=0.0, description="Video duration in seconds")
    fps: float = Field(gt=0.0, description="Frames per second")
    total_sperm: int = Field(ge=0, description="Total number of tracked sperm")
    motile_sperm: int = Field(ge=0, description="Number of motile sperm")
    motility_percentage: float = Field(ge=0.0, le=100.0, description="Motility percentage")
    average_velocity: float = Field(ge=0.0, description="Average velocity")
    velocity_variation: float = Field(ge=0.0, description="Velocity variation")
    movement_patterns: MovementPatterns
    temporal_analysis: TemporalAnalysis
    motility_classification: str = Field(description="Motility classification")
    clinical_interpretation: str = Field(description="Clinical interpretation text")

class AnalysisResponse(BaseModel):
    success: bool = Field(description="Whether analysis was successful")
    result_id: str = Field(description="Unique identifier for the analysis result")
    file_id: str = Field(description="Identifier of the analyzed file")
    analysis_type: str = Field(description="Type of analysis performed")
    results: Dict[str, Any] = Field(description="Processed analysis results")
    charts: Dict[str, str] = Field(description="Paths to generated chart images")
    analysis_time: str = Field(description="ISO timestamp of analysis completion")

class AnalysisResult(BaseModel):
    result_id: str = Field(description="Unique identifier for the result")
    file_id: str = Field(description="Original file identifier")
    processed_results: Dict[str, Any] = Field(description="Complete processed results")
    chart_paths: Dict[str, str] = Field(description="Paths to chart files")
    created_at: str = Field(description="ISO timestamp of result creation")

class ChartData(BaseModel):
    result_id: str = Field(description="Result identifier")
    analysis_type: str = Field(description="Type of analysis")
    charts: Dict[str, str] = Field(description="Chart URLs")
    time_series_data: Optional[TimeSeriesData] = Field(description="Time series data for interactive charts")

class AnalysisHistoryItem(BaseModel):
    result_id: str = Field(description="Result identifier")
    file_id: str = Field(description="File identifier")
    type: str = Field(description="Analysis type")
    timestamp: str = Field(description="Analysis timestamp")
    summary: Dict[str, Any] = Field(description="Summary statistics")

class AnalysisHistory(BaseModel):
    success: bool = Field(description="Whether request was successful")
    history: List[AnalysisHistoryItem] = Field(description="List of previous analyses")

class UploadResponse(BaseModel):
    success: bool = Field(description="Whether upload was successful")
    file_id: str = Field(description="Unique file identifier")
    file_path: str = Field(description="Path to uploaded file")
    file_type: str = Field(description="Type of uploaded file")
    file_size: int = Field(ge=0, description="File size in bytes")
    upload_time: str = Field(description="ISO timestamp of upload")

class ErrorResponse(BaseModel):
    success: bool = Field(default=False, description="Always false for errors")
    error: str = Field(description="Error message")
    error_code: Optional[str] = Field(description="Error code if applicable")
    details: Optional[Dict[str, Any]] = Field(description="Additional error details")

class HealthResponse(BaseModel):
    status: str = Field(description="Health status")
    timestamp: str = Field(description="Current timestamp")
    version: Optional[str] = Field(description="API version")
    uptime: Optional[float] = Field(description="Uptime in seconds")

class StorageStats(BaseModel):
    total_files: int = Field(ge=0, description="Total number of files")
    total_size_bytes: int = Field(ge=0, description="Total size in bytes")
    total_size_mb: float = Field(ge=0.0, description="Total size in MB")
    free_space_bytes: int = Field(ge=0, description="Free space in bytes")
    free_space_mb: float = Field(ge=0.0, description="Free space in MB")
    total_space_bytes: int = Field(ge=0, description="Total space in bytes")
    total_space_mb: float = Field(ge=0.0, description="Total space in MB")
    upload_directory: str = Field(description="Upload directory path")

class DeleteResponse(BaseModel):
    success: bool = Field(description="Whether deletion was successful")
    message: str = Field(description="Deletion result message")

# Chart-specific response models
class QualityChartData(BaseModel):
    labels: List[str] = Field(description="Chart labels")
    data: List[int] = Field(description="Chart data values")
    colors: List[str] = Field(description="Chart colors")
    title: str = Field(description="Chart title")

class MotilityChartData(BaseModel):
    motile_count: int = Field(ge=0, description="Number of motile sperm")
    non_motile_count: int = Field(ge=0, description="Number of non-motile sperm")
    motility_percentage: float = Field(ge=0.0, le=100.0, description="Motility percentage")
    title: str = Field(description="Chart title")

class TimeSeriesChartData(BaseModel):
    timestamps: List[float] = Field(description="Time points")
    counts: List[int] = Field(description="Sperm counts")
    title: str = Field(description="Chart title")
    x_label: str = Field(description="X-axis label")
    y_label: str = Field(description="Y-axis label")

class MovementPatternsChartData(BaseModel):
    linear: int = Field(ge=0, description="Linear swimmers count")
    circular: int = Field(ge=0, description="Circular swimmers count")
    erratic: int = Field(ge=0, description="Erratic swimmers count")
    title: str = Field(description="Chart title")

# Comprehensive chart response
class ChartsResponse(BaseModel):
    result_id: str = Field(description="Result identifier")
    analysis_type: str = Field(description="Analysis type")
    available_charts: List[str] = Field(description="List of available chart types")
    chart_urls: Dict[str, str] = Field(description="URLs to chart images")
    interactive_data: Optional[Dict[str, Any]] = Field(description="Data for interactive charts")

# Configuration models
class AnalysisConfig(BaseModel):
    confidence_threshold: float = Field(ge=0.0, le=1.0, default=0.25, description="Detection confidence threshold")
    max_file_size_mb: int = Field(gt=0, default=100, description="Maximum file size in MB")
    analysis_timeout_seconds: int = Field(gt=0, default=300, description="Analysis timeout in seconds")
    enable_gpu: bool = Field(default=True, description="Whether to use GPU acceleration")
    save_intermediate_results: bool = Field(default=False, description="Whether to save intermediate results")

class ModelInfo(BaseModel):
    model_name: str = Field(description="Model name")
    model_version: str = Field(description="Model version")
    trained_on: str = Field(description="Training data description")
    accuracy_metrics: Dict[str, float] = Field(description="Model accuracy metrics")
    supported_formats: List[str] = Field(description="Supported file formats")
    device: str = Field(description="Device used for inference")

# API status and info
class APIInfo(BaseModel):
    title: str = Field(description="API title")
    version: str = Field(description="API version")
    description: str = Field(description="API description")
    model_info: ModelInfo = Field(description="AI model information")
    supported_features: List[str] = Field(description="List of supported features")
    endpoints: List[str] = Field(description="Available endpoints")