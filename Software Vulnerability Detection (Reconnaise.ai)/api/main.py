# FastAPI dependencies
from fastapi import FastAPI
from fastapi import Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.testclient import TestClient

# Backend dependencies
from backend.ml_detector import VulnerabilityDetector
from backend.vuln_rules import RuleBasedDetector

# Other dependencies for data loading and processing
import numpy as np
import pandas as pd
import json

# Merely used for environment variables
import os


# Environment variables
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://0.0.0.0")

# Datasets
data_frame = pd.read_csv("backend/data/merged_all_datasets.csv")

# AI/ML Models
ml_detector = VulnerabilityDetector("backend/models")
rule_detector = RuleBasedDetector()
vectoriser = ml_detector.vectorizer
models = ml_detector.models


# FastAPI app
app = FastAPI(
	title="Reconnaise API",
	description="API for Reconnaise.ai Project, COS30049 Assignment 3",
	version="1.0.0",
)


# MARK: Middleware
app.add_middleware(
	CORSMiddleware,
	allow_credentials=True,
	allow_origins=[
		"http://localhost:5173",  # Development port
		"http://localhost:8080",  # Production port

		# Localhost alternative
		"http://127.0.0.1:5173",
		"http://127.0.0.1:8080",

		# Docker container
		f"{FRONTEND_ORIGIN}:5173",
		f"{FRONTEND_ORIGIN}:8080",
	],
	allow_headers=["*"],
	allow_methods=["GET", "POST"],
)


testClient = TestClient(app)


def test_cors_for_scan():
	response = testClient.options(
		"/scan/python",
		headers={
			"Origin": "http://example.com",
			"Access-Control-Request-Method": "POST",
			"Access-Control-Request-Headers": "Content-Type",
		},
	)
	assert response.status_code == 200
	assert response.headers.get("access-control-allow-origin") == "*"
	assert "POST" in response.headers.get("access-control-allow-methods", "")
	assert "Content-Type" in response.headers.get("access-control-allow-headers", "")


def serialise_numpy(obj):
	"""Convert NumPy types to native Python types for JSON serialization."""
	if isinstance(obj, np.bool_): return bool(obj)
	elif isinstance(obj, np.integer): return int(obj)
	elif isinstance(obj, np.floating): return float(obj)
	elif isinstance(obj, np.ndarray): return obj.tolist()
	elif isinstance(obj, dict): return {key: serialise_numpy(value) for key, value in obj.items()}
	elif isinstance(obj, list): return [serialise_numpy(item) for item in obj]
	return obj


# MARK: Static files
app.mount("/docs", StaticFiles(directory="backend/docs"), name="docs")
app.mount("/pics", StaticFiles(directory="backend/pics"), name="pics")


@app.get("/")
async def root():
	return RedirectResponse(url="/docs")


# MARK: Scan endpoints
@app.post("/scan/{language}")
async def scan_code(language: str, code: str = Body(..., media_type="text/plain")):
	ml_results = ml_detector.predict(code)
	rule_results = rule_detector.analyze(code, language.lower())

	return {
		"ml_based_findings": serialise_numpy(ml_results),
		"rule_based_findings": serialise_numpy(rule_results)
	}


# MARK: Model endpoints
@app.get("/models/descriptions")
async def get_model_descriptions():
	return json.load(open("backend/metadata/model_descriptions.json"))


@app.get("/models/comparison")
async def get_model_comparison():
	df = pd.read_csv("backend/docs/model_comparison.csv")
	return [
		{
			"model": row["Model"],
			"accuracy": float(row["Accuracy"]),
			"precision": float(row["Precision"]),
			"recall": float(row["Recall"]),
			"f1_score": float(row["F1-Score"]),
			"training_time": float(row["Training Time (s)"]),
		}
		for _, row in df.iterrows()
	]


@app.get("/models/feature-importances")
async def get_model_feature_importances():
	feature_names = vectoriser.get_feature_names_out()[:50]
	model_names = [name for name in models if hasattr(models[name], "feature_importances_")]
	return [
		{
			"model": model_name,
			"feature_importances": {
				feature: float(importance)
				for feature, importance in zip(
					feature_names,
					models[model_name].feature_importances_[:50]
				)
			}
		}
		for model_name in model_names
	]


# MARK: Exploratory Data Analysis endpoint
@app.get("/eda/datasets")
async def get_eda_datasets():
	return json.load(open("backend/metadata/datasets.json"))


@app.get("/eda/overview")
async def get_eda_overview():
	return {
		"total_samples": len(data_frame),
		"safe_samples": sum(data_frame["is_vulnerable"] == 0),
		"vulnerable_samples": sum(data_frame["is_vulnerable"] == 1),
	}


@app.get("/eda/top-rows/{count}")
async def get_eda_top_rows(count: int):
	return data_frame.head(count).to_dict(orient="records")


# MARK: Team members endpoint
@app.get("/team/members")
async def get_team_members():
	return json.load(open("backend/metadata/team_members.json"))

