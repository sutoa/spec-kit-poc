#!/bin/bash
source backend/venv/bin/activate
uvicorn backend.app.main:app --reload --port 8000