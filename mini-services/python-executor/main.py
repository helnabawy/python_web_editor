import asyncio
import subprocess
import sys
from typing import Optional
from pydantic import BaseModel, Field, field_validator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


# Pydantic models for request/response validation
class CodeExecutionRequest(BaseModel):
    """Request model for code execution with validation"""
    
    code: str = Field(
        ...,
        min_length=1,
        max_length=100000,
        description="Python code to execute"
    )
    
    timeout: Optional[int] = Field(
        default=30,
        ge=1,
        le=120,
        description="Execution timeout in seconds (max 120)"
    )
    
    @field_validator('code')
    @classmethod
    def validate_code(cls, v: str) -> str:
        """Additional code validation"""
        # Check for potentially dangerous imports (basic security)
        dangerous_patterns = [
            'import os',
            'import sys',
            'import subprocess',
            'from os import',
            'from sys import',
            'from subprocess import',
            '__import__',
            'eval(',
            'exec(',
            'compile(',
            'open(',
            'import shutil',
            'import socket',
        ]
        
        code_lower = v.lower()
        for pattern in dangerous_patterns:
            if pattern in code_lower:
                raise ValueError(f"Potentially unsafe code detected: '{pattern}' is not allowed for security reasons")
        
        return v.strip()


class CodeExecutionResponse(BaseModel):
    """Response model for code execution"""
    
    success: bool = Field(description="Whether execution was successful")
    output: Optional[str] = Field(default=None, description="Standard output from execution")
    error: Optional[str] = Field(default=None, description="Error message if execution failed")
    exit_code: Optional[int] = Field(default=None, description="Process exit code")


class HealthResponse(BaseModel):
    """Health check response model"""
    
    status: str = Field(description="Service status")
    service: str = Field(description="Service name")
    python_version: str = Field(description="Python version")


# Initialize FastAPI app
app = FastAPI(
    title="Python Code Executor Service",
    description="Service for executing Python code with Pydantic validation",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    Returns service status and Python version
    """
    return HealthResponse(
        status="ok",
        service="python-executor",
        python_version=f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    )


@app.post("/api/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    """
    Execute Python code with validation
    
    - **code**: Python code to execute (validated by Pydantic)
    - **timeout**: Execution timeout in seconds (default: 30, max: 120)
    
    Returns execution output or error message
    """
    try:
        # Execute Python code using subprocess
        process = await asyncio.create_subprocess_exec(
            sys.executable,
            "-c",
            request.code,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        
        # Wait for completion with timeout
        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=request.timeout
            )
        except asyncio.TimeoutError:
            process.kill()
            return CodeExecutionResponse(
                success=False,
                error=f"Execution timed out after {request.timeout} seconds",
                exit_code=-1
            )
        
        # Decode output
        stdout_text = stdout.decode('utf-8') if stdout else ""
        stderr_text = stderr.decode('utf-8') if stderr else ""
        
        # Determine success
        exit_code = process.returncode
        
        if exit_code == 0:
            return CodeExecutionResponse(
                success=True,
                output=stdout_text,
                exit_code=exit_code
            )
        else:
            # Execution failed
            error_msg = stderr_text if stderr_text else "Execution failed without error message"
            return CodeExecutionResponse(
                success=False,
                output=stdout_text if stdout_text else None,
                error=error_msg,
                exit_code=exit_code
            )
            
    except ValueError as e:
        # Validation error from Pydantic
        raise HTTPException(
            status_code=400,
            detail=f"Validation error: {str(e)}"
        )
    except Exception as e:
        # Unexpected error
        return CodeExecutionResponse(
            success=False,
            error=f"Service error: {str(e)}",
            exit_code=-1
        )


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "Python Code Executor",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "execute": "/api/execute"
        },
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3010)
