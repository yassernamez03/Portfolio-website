# Diabetic Retinopathy Detection App — Deep Project Analysis

**Repository:** [yassernamez03/Diabetic-Retinopathy-Detection-App](https://github.com/yassernamez03/Diabetic-Retinopathy-Detection-App)  
**Application name used in the interface:** VisionGuardian  
**Analysis basis:** Full uploaded source archive, including Flask routes, image-processing functions, chatbot code and training data, Jinja templates, JavaScript, bundled artifacts, and repository structure.

> This is a static source-code review. The diagnostic model files referenced by the application are not included in the archive, so their internal architectures, weights, calibration, and measured performance could not be independently verified.

# Executive Summary

The project is a Flask web application intended to support three retinal-image workflows:

1. **Binary diabetic-retinopathy detection**
2. **Five-class diabetic-retinopathy severity classification**
3. **Retinal-lesion segmentation**

The application also contains account registration and login, MongoDB-backed users and chat history, password recovery, a neural-network intent chatbot, multiple conversations, theme switching, and result visualizations.

The computer-vision workflow combines image preprocessing with several separately saved Keras models. It compares predictions from a preprocessed retinal image with predictions derived from microaneurysm, haemorrhage, and hard-exudate segmentations.

The design is academically interesting because it connects lesion segmentation with binary detection and severity classification.

The repository is not self-contained because it does not include the eleven referenced diagnostic models, required runtime directories, a dependency manifest, database initialization, automated tests, or a production server configuration.

The most important technical limitations are missing model artifacts, likely image-tensor rank mismatches, incorrect cached-inference behavior, repeated model loading, incomplete packaging, and absent clinical-validation evidence.

The project should be positioned as an **academic medical-image analysis prototype**, not a clinically validated diagnostic product.

# Repository Composition

Approximate archive contents:

| File type | Count | Approximate text lines |
|---|---:|---:|
| Python | 8 | 973 |
| HTML/Jinja | 19 | 2,399 |
| CSS | 1 | 833 |
| JavaScript | 2 | 360 |
| JSON | 2 | 380 |
| Markdown | 1 | 34 |
| Chatbot Keras model | 1 | Binary artifact |
| Pickle artifacts | 2 | Binary artifacts |
| PNG assets | 16 | Binary assets |
| Demo video | 1 | Binary asset |

The HTML templates contain a large amount of inline CSS and JavaScript, making the frontend source substantially larger than the backend code.

# Source Structure

```text
Diabetic-Retinopathy-Detection-App/
├── app.py
├── functions.py
├── form.py
├── ChatBot.py
├── Bot_functions.py
├── README.md
├── LICENSE.txt
├── Média1.mp4
├── BotData/
│   ├── Data.json
│   ├── Training.py
│   ├── test_model.h5
│   ├── words_test.pkl
│   └── classes_test.pkl
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── binaryclassifier.html
│   ├── binaryresults.html
│   ├── segmentationclassifier.html
│   ├── segmentationresults.html
│   ├── multiclassifier.html
│   ├── multiresults.html
│   ├── bot.html
│   ├── reset.html
│   ├── verify.html
│   └── resetpassword.html
├── static/
│   ├── css/style.css
│   ├── js/ajax.js
│   ├── js/script.js
│   ├── data/
│   └── res/
├── project/
│   ├── multidr/
│   └── segmentationdr/
└── __pycache__/
```

The directories under `project/` contain empty Python and template files and do not participate in the Flask application.

# Technology Stack

## Backend

- Python
- Flask
- Jinja2
- Flask-WTF
- WTForms
- Werkzeug password hashing
- PyMongo
- BSON `ObjectId`

## Computer Vision and Machine Learning

- TensorFlow
- Keras
- OpenCV
- NumPy
- scikit-image
- CLAHE
- Gaussian filtering
- Saved HDF5 models

## Chatbot and NLP

- NLTK
- WordNet lemmatization
- Bag-of-words encoding
- Keras dense neural network
- Pickle vocabulary and class artifacts

## Frontend

- HTML
- CSS
- JavaScript
- jQuery
- AJAX
- Jinja templates
- Google fonts and Material symbols
- D3-based or custom chart rendering in result templates

## Database and External Service

- MongoDB
- SendGrid through RapidAPI for recovery email

# Main Application Features

## Dashboard

Authenticated users receive three main choices:

```text
DR Detection
DR Classification
DR Segmentation
```

## Binary Detection

The binary workflow produces four prediction sets:

- Preprocessed retinal image
- Microaneurysm-focused image
- Haemorrhage-focused image
- Hard-exudate-focused image

For each input variant, the interface displays:

```text
Probability of no diabetic retinopathy
Probability of diabetic retinopathy
```

## Five-Class Classification

The multi-class workflow displays five classes:

```text
0 → No DR
1 → Mild
2 → Moderate
3 → Severe
4 → Proliferative DR
```

Predictions are generated for the same four image variants used by the binary workflow.

## Segmentation

The segmentation workflow creates masks for:

- Microaneurysms
- Haemorrhages
- Hard exudates

The resulting masks are written into the web application's static upload directory and displayed in the browser.

## Chatbot

The chatbot provides:

- Multiple chat sessions
- Chat creation and deletion
- Persistent messages in MongoDB
- Generic conversation intents
- Date and time answers
- Static diabetic-retinopathy treatment information
- Fallback responses

# Computer-Vision Pipeline

## 1. File Upload

The browser submits an image through a multipart form.

The backend saves it under:

```text
static/uploads/<original filename>
```

The filename is used directly without sanitization.

## 2. Grayscale Loading

The application loads the uploaded image with:

```python
cv2.imread(path, cv2.IMREAD_GRAYSCALE)
```

All diagnostic workflows therefore operate on a single grayscale channel.

## 3. Preprocessing

`preprocess_image()` performs:

1. Conversion to `uint8` when required
2. CLAHE with:
   - Clip limit: `2.0`
   - Grid size: `8 × 8`
3. Intensity scaling through:
   - `cv2.convertScaleAbs(..., alpha=1.2)`
4. Gaussian filtering:
   - Sigma: `0.5`
5. Addition of a one-channel dimension

Conceptual flow:

```text
Retinal image
      │
      ▼
Grayscale conversion
      │
      ▼
CLAHE contrast enhancement
      │
      ▼
Intensity adjustment
      │
      ▼
Gaussian denoising
      │
      ▼
Single-channel processed image
```

## 4. Segmentation

Each lesion has a dedicated segmentation model:

```text
Microaneurysm U-Net
Haemorrhage U-Net
Hard-exudate U-Net
```

The source:

1. Resizes the image to `512 × 512`
2. Runs the relevant saved model
3. Applies a hard threshold of `0.99`
4. Converts the output to a binary mask

## 5. Binary Classification

The binary classifiers use `300 × 300` inputs.

There are four intended binary models:

```text
Original/preprocessed-image classifier
Microaneurysm-mask classifier
Haemorrhage-mask classifier
Hard-exudate-mask classifier
```

## 6. Multi-Class Classification

The severity classifiers also use `300 × 300` inputs and return five scores.

There are four intended multi-class models:

```text
Original/preprocessed-image classifier
Microaneurysm-mask classifier
Haemorrhage-mask classifier
Hard-exudate-mask classifier
```

# Expected Diagnostic Model Inventory

The source references the following eleven files:

```text
static/models/Binary_model.h5

static/models/Microaneurysm_u-net_preprocessed.h5
static/models/Haemorrhages_u-net_preprocessed.h5
static/models/HardExudates_u-net_preprocessed.h5

static/models/Binary_Microaneurysm_model.h5
static/models/Binary_Haemorrhages_model.h5
static/models/Binary_HardExudates_model.h5

static/models/Multi_model.h5
static/models/Multi_Microaneurysm_model.h5
static/models/Multi_Haemorrhages_model.h5
static/models/Multi_HardExudates_model.h5
```

None is included in the uploaded repository archive.

The README points to an external Kaggle model collection, but it does not document:

- Exact downloadable filenames
- Model versions
- Model checksums
- Training datasets
- Training preprocessing
- Input tensor shapes
- Class mapping metadata
- Validation metrics
- Calibration metrics
- License terms for model weights

# Diagnostic Workflows

## Binary Workflow

```text
Uploaded retinal image
        │
        ▼
Grayscale preprocessing
        │
        ├── Direct binary classifier
        │
        ├── Microaneurysm segmentation
        │       └── Lesion-based binary classifier
        │
        ├── Haemorrhage segmentation
        │       └── Lesion-based binary classifier
        │
        └── Hard-exudate segmentation
                └── Lesion-based binary classifier
```

## Severity Workflow

```text
Uploaded retinal image
        │
        ▼
Grayscale preprocessing
        │
        ├── Direct five-class classifier
        │
        ├── Microaneurysm segmentation
        │       └── Lesion-based five-class classifier
        │
        ├── Haemorrhage segmentation
        │       └── Lesion-based five-class classifier
        │
        └── Hard-exudate segmentation
                └── Lesion-based five-class classifier
```

## Segmentation Workflow

```text
Uploaded retinal image
        │
        ▼
Preprocessing
        │
        ├── Microaneurysm mask
        ├── Haemorrhage mask
        └── Hard-exudate mask
```

# Chatbot Architecture

## Intent Data

`BotData/Data.json` defines 34 intents.

They include:

- Greetings
- Goodbyes
- Date and time
- Generic help
- Generic conversation
- Treatment information
- Prevention information
- Emergency information
- Fallback behavior

Medical intents include:

- General treatment
- Mild non-proliferative DR treatment
- Moderate non-proliferative DR treatment
- Severe non-proliferative DR treatment
- Proliferative DR treatment
- Macular-edema treatment
- Emergency cases
- Prevention strategies

## Text Processing

The chatbot:

1. Tokenizes the message with NLTK
2. Lemmatizes each token
3. Builds a binary bag-of-words vector
4. Runs a Keras intent classifier
5. Filters predictions below `0.25`
6. Uses fallback unless the top score reaches `0.9`
7. Chooses a random response from the matched intent

## Chatbot Model

The training script defines:

```text
Input bag-of-words vector
        │
        ▼
Dense layer: 128 ReLU
        │
        ▼
Dropout: 0.5
        │
        ▼
Dense layer: 64 ReLU
        │
        ▼
Dropout: 0.5
        │
        ▼
Softmax intent output
```

Training configuration:

- Optimizer: legacy SGD
- Learning rate: `0.01`
- Momentum: `0.9`
- Nesterov: enabled
- Epochs: `200`
- Batch size: `5`
- Loss: categorical cross-entropy

No train/test split or chatbot evaluation results are included.

# MongoDB Data Model

## Users

```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "Werkzeug password hash"
}
```

## Chats

```json
{
  "_id": "ObjectId",
  "user": "user ID stored as string"
}
```

## Messages

User message:

```json
{
  "_id": "ObjectId",
  "user": "user ID",
  "chat": "chat ID",
  "message": "text",
  "type": "user",
  "date": "DD/MM/YYYY HH:MM:SS"
}
```

Bot message:

```json
{
  "_id": "ObjectId",
  "bot": "user ID",
  "chat": "chat ID",
  "message": ["NORMAL REPLY", "response text"],
  "type": "bot",
  "date": "DD/MM/YYYY HH:MM:SS"
}
```

# Authentication and Recovery Workflows

## Registration

1. Validate WTForms inputs.
2. Compare password and confirmation.
3. Check for duplicate email.
4. Hash the password.
5. Insert the user.
6. Create the user's first chat.
7. Start a session.

## Login

1. Find user by exact email.
2. Verify the password hash.
3. Store the user ID in the Flask session.
4. Redirect to the dashboard.

## Recovery

1. Submit email.
2. Generate a six-digit code.
3. Send it through RapidAPI/SendGrid.
4. Verify the code.
5. Accept a new password.
6. Replace the stored hash.

# Positive Engineering Decisions

- Passwords are stored as hashes rather than plaintext.
- Flask-WTF forms are used for authentication and recovery pages.
- The application separates image-processing code from route code.
- Lesion segmentation is treated as a distinct workflow.
- The project compares original-image and lesion-focused predictions.
- Messages and conversations are persisted in MongoDB.
- User messages are appended into the page as text rather than HTML.
- Medical treatment content has a fallback intent.
- The dashboard separates detection, classification, and segmentation.
- The repository includes an MIT license.
- The frontend provides upload preview, loading states, result charts, and theme switching.

# Functional and Correctness Review

## Summary

| Severity | Finding |
|---|---|
| Critical | Diagnostic model files are absent |
| Critical | Required upload and model directories are absent |
| High | Standard convolutional model inputs likely have the wrong tensor rank |
| High | Cached inference processes the wrong data and numeric scale |
| High | Signup redirects to a nonexistent endpoint |
| High | Password mismatch does not prevent account creation |
| Medium | Models are loaded from disk repeatedly |
| Medium | Upload cleanup is global across users |
| Medium | No dependency file or reproducible environment |
| Medium | NLTK resources are not bootstrapped |
| Medium | Chatbot retraining path has a case mismatch |
| Medium | No inference API exists despite the README claim |
| Low | Empty framework remnants and stale assets are committed |

# Critical Finding 1: Missing Diagnostic Models

Every medical workflow depends on model files under `static/models/`, but the directory and all referenced files are absent.

## Impact

- Binary detection cannot run.
- Severity classification cannot run.
- Lesion segmentation cannot run.
- The result pages cannot be produced.
- The application is not reproducible from the repository.

## Required action

Create a model manifest such as:

```yaml
models:
  binary:
    path: models/binary-v1.keras
    sha256: ...
    input_shape: [300, 300, 1]
    output_labels: [no_dr, dr]
  severity:
    path: models/severity-v1.keras
    sha256: ...
    input_shape: [300, 300, 1]
    output_labels: [no_dr, mild, moderate, severe, proliferative]
```

Provide either:

- A release artifact with checksums
- A documented download script
- A model registry
- A container image containing the approved model versions

# Critical Finding 2: Missing Runtime Directories

The source assumes:

```text
static/uploads/
static/models/
```

Neither exists in the archive.

`clear_uploads()` immediately calls `os.listdir()` and therefore fails when `static/uploads/` is absent.

## Required action

Create required directories during application startup:

```python
Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)
```

Model availability should be validated once during startup with a clear error report.

# High Finding 2: Likely Tensor-Rank Mismatch

The preprocessing function returns a shape similar to:

```text
height × width × 1
```

OpenCV usually removes the final singleton channel when resizing a one-channel array:

```text
cv2.resize(H × W × 1) → H × W
```

The code then adds only a batch dimension:

```text
1 × H × W
```

A standard Keras `Conv2D` or U-Net model normally expects:

```text
1 × H × W × 1
```

Unless the saved models contain an unusual input adapter, the application is likely to raise an input-shape error.

## Required action

Use a shared tensor function:

```python
image = cv2.resize(image, size)
if image.ndim == 2:
    image = image[..., np.newaxis]
image = image.astype(np.float32)
image = np.expand_dims(image, axis=0)
```

Validate the final shape against `model.input_shape`.

# High Finding 3: Incorrect Cached Inference

When generated image files already exist, the application does not reuse stored probabilities. It runs inference again.

The cached path has two major problems.

## Numeric Scale Mismatch

The original preprocessed array is approximately in a normalized floating-point range.

It is saved after multiplication by 255.

The cached branch loads the PNG as values in approximately:

```text
0–255
```

and passes those values directly to the classifier.

This does not match the original inference scale.

## Wrong Semantic Input

The cached branch sends an already segmented mask back into a function that first runs the lesion segmenter again.

Conceptually:

```text
Correct:
preprocessed retina → segmenter → mask → mask classifier

Cached implementation:
saved mask → segmenter again → second mask → mask classifier
```

## Required action

Either:

- Store prediction results in a database/cache and reuse them, or
- Reconstruct the exact original pipeline from the original uploaded image

Do not infer from generated masks through the full segmentation pipeline again.

# High Finding 4: Broken Registration Redirect

Successful registration calls:

```python
url_for("homepage")
```

No `homepage` route exists.

The intended target appears to be `dashboard` or `home`.

## Impact

A successfully created user may receive a Flask routing error immediately after signup.

# High Finding 5: Password Mismatch Still Creates an Account

The registration route sets an error when passwords differ but does not stop execution.

The code continues into duplicate checking and account insertion.

## Required action

Use an immediate return or a proper WTForms `EqualTo` validator.

# Medical and Clinical Safety Review

## Risk Summary

| Severity | Clinical/ML issue |
|---|---|
| Critical | No documented external validation or clinical validation |
| Critical | Missing model provenance and versioning |
| High | Application language implies diagnostic trustworthiness |
| High | No image-quality rejection |
| High | No uncertainty or abstention mechanism |
| High | No documented sensitivity/specificity by class |
| High | No evidence of calibration |
| High | No clinician-review requirement in the workflow |
| High | Treatment chatbot provides medical guidance without citations |
| Medium | Grayscale conversion may discard relevant color information |
| Medium | Very high segmentation threshold is undocumented |
| Medium | No camera/domain-shift handling |
| Medium | No audit trail for medical predictions |
| Medium | No model monitoring |
| Medium | No privacy, consent, or retention controls |
| Medium | No explanation of intended population or contraindications |

## Diagnostic Claims

The landing page describes the system as delivering:

- Precise diagnostics
- Timely diagnostics
- Actionable insights
- Trustworthy tools for medical professionals

The repository contains no evidence supporting those claims.

## Required positioning

Use wording such as:

> Research prototype for retinal-image analysis. Outputs are not a medical diagnosis and require review by a qualified ophthalmology professional.

## Missing Validation Evidence

The application should document at least:

- Dataset sources
- Patient-level split strategy
- Camera/device distribution
- Inclusion and exclusion criteria
- Class prevalence
- Sensitivity
- Specificity
- ROC-AUC
- Precision and recall
- Confusion matrix
- Calibration
- External validation
- Subgroup analysis
- Confidence intervals
- Failure cases

## Image Quality

The application performs no check for:

- Non-retinal images
- Blurred images
- Underexposure
- Overexposure
- Small field of view
- Occlusion
- Incorrect focus
- Wrong image orientation
- Excessive compression
- Camera artifacts

It will attempt to classify any decodable grayscale image.

## Grayscale Input

Fundus imagery contains clinically informative color characteristics.

The application converts every image directly to grayscale. This may be appropriate only when the models were trained on the exact same representation.

The deployment repository does not prove preprocessing parity with training.

## Segmentation Threshold

All lesion masks use:

```text
probability > 0.99
```

This is unusually strict and may suppress lower-confidence lesion pixels.

A threshold should be selected from validation data and recorded per model.

## Uncertainty

The system displays percentages but does not:

- Measure calibration
- Reject ambiguous cases
- Flag out-of-distribution images
- Require minimum confidence
- Explain disagreement among the four prediction streams

Displaying a percentage does not make it a clinically meaningful probability.

## Multiple Prediction Streams

The interface presents four prediction results but does not define a final decision rule.

It does not explain whether the user should:

- Prefer the direct classifier
- Average the results
- Use lesion-specific outputs as supporting evidence
- Escalate when models disagree

This can confuse users and create inconsistent decisions.

## Medical Chatbot

The chatbot provides treatment descriptions involving:

- Blood-glucose control
- Laser treatment
- Anti-VEGF treatment
- Vitrectomy
- Corticosteroids

The responses are static, uncited, and selected by a small intent classifier.

The chatbot should not provide patient-specific treatment guidance. It should:

- Cite reviewed sources
- State that it cannot diagnose or prescribe
- Encourage ophthalmology consultation
- Use a medically reviewed content version
- Escalate emergency symptoms
- Log content provenance and review date

# Performance and Reliability Review

## Repeated Model Loading

Every prediction function calls `load_model()`.

A binary analysis may load approximately seven models:

```text
1 direct classifier
3 segmentation models
3 lesion-based classifiers
```

The five-class workflow repeats the same pattern.

## Impact

- High latency
- Excessive disk I/O
- Repeated TensorFlow initialization
- Memory pressure
- Poor concurrency
- Easy denial of service

## Required action

Load models once during application initialization or through a cached model registry.

## Synchronous Inference

Inference runs inside the Flask request.

Long-running requests can block a development server worker.

Recommended options:

- Production WSGI server
- Dedicated inference service
- Task queue
- GPU worker
- Request timeout
- Bounded concurrency

## Global Upload Cleanup

Opening the binary or multi-class upload page calls `clear_uploads()`.

That function deletes all files in the shared upload directory.

In a multi-user application, one user opening a page can delete another user's:

- Uploaded image
- Preprocessed output
- Segmentation output
- Pending result

## Filename Collisions

Two users uploading `image.png` write to the same path.

Generated output names also collide.

Use generated per-request identifiers and per-user authorization.

## No Database Indexes

The repository does not create indexes for:

```text
users.email
chats.user
messages.chat
```

Indexes and a unique email constraint should be created during initialization.

## External Email Request

The email request has no explicit timeout, retry policy, or error handling.

A stalled external service may block the request.

# Chatbot Reliability Review

## Missing NLTK Setup

A clean environment may not contain:

- Punkt tokenizer data
- WordNet corpus

The repository does not download or document these resources.

## Broken Automatic Training Path

If `test_model.h5` is missing, the application attempts to open:

```text
BotData/training.py
```

The actual filename is:

```text
BotData/Training.py
```

This fails on case-sensitive systems.

## Training During Application Import

Automatically training for 200 epochs during web-server import is not suitable for production.

Training and inference should be separate commands and artifacts.

## Small Intent Dataset

Most medical intents contain only three patterns and one response.

The high confidence threshold reduces accidental matching but does not establish clinical reliability.

## No Conversation Context

Each message is classified independently.

Stored chat history is displayed but not used by the chatbot model to understand follow-up questions.

# README and Interface Accuracy Review

## README Claim: REST API

The README says the application provides RESTful API endpoints for detection and classification.

The implementation does not provide a medical-inference API.

The `/api/...` routes are for:

- Current user ID
- Chat identifiers
- Chat messages

## Landing Page Remnants

The landing page lists:

- Yahoo Finance
- Twelve Data
- CoinMarketCap API

These are unrelated to diabetic-retinopathy analysis.

The registration page refers to:

```text
StockSensei
```

The password-recovery email sender also uses a StockSensei identity.

## Stale Assets

`static/data/` contains stock-prediction charts, including Tesla price forecasts, rather than retinal-analysis outputs.

These are remnants from another project.

## Incorrect Technology Claim

The landing page lists scikit-learn, but the current application source uses TensorFlow/Keras for prediction and scikit-image for preprocessing. No scikit-learn code appears in the repository.

## Empty Directory Structure Section

The README contains a “Directory Structure” heading without content.

## Missing Setup Documentation

The README does not provide:

- Python version
- Dependency installation
- MongoDB setup
- NLTK setup
- Model download commands
- Upload-directory setup
- Environment variables
- Run command
- Production deployment
- Test command

# Architecture Assessment

## Current Architecture

```text
Browser
   │
   ├── Jinja pages
   ├── Upload forms
   └── jQuery AJAX chatbot
          │
          ▼
     Monolithic Flask app
          │
   ┌──────┼──────────────┐
   ▼      ▼              ▼
MongoDB  Keras models  Email API
users    loaded per    password
chats    request       recovery
messages
```

## Main Structural Weakness

`app.py` combines:

- Authentication
- Recovery
- Image upload
- Inference orchestration
- Chat management
- API responses
- Application setup

This makes authorization, testing, and error handling difficult.

# Recommended Target Architecture

```text
app/
├── __init__.py
├── config.py
├── extensions.py
├── auth/
│   ├── routes.py
│   ├── forms.py
│   └── services.py
├── inference/
│   ├── routes.py
│   ├── preprocessing.py
│   ├── model_registry.py
│   ├── schemas.py
│   └── service.py
├── chatbot/
│   ├── routes.py
│   ├── model.py
│   └── repository.py
├── storage/
│   ├── uploads.py
│   └── mongo.py
├── templates/
├── static/
└── tests/
```

# Recommended Inference Architecture

```text
Authenticated request
        │
        ▼
File validation and safe re-encoding
        │
        ▼
Image-quality assessment
        │
        ├── Reject unsuitable image
        │
        └── Continue
                │
                ▼
Versioned preprocessing pipeline
                │
                ▼
Cached model registry
                │
     ┌──────────┼───────────┐
     ▼          ▼           ▼
Binary model  Severity    Lesion segmenters
              model
     │          │           │
     └──────────┼───────────┘
                ▼
Calibration and uncertainty rules
                │
                ▼
Structured result object
                │
                ▼
Clinician-facing explanation and disclaimer
                │
                ▼
Audited result with model version
```

# Recommended Structured Result

```json
{
  "analysis_id": "UUID",
  "model_version": "dr-suite-1.0.0",
  "created_at": "ISO-8601",
  "image_quality": {
    "accepted": true,
    "score": 0.94,
    "warnings": []
  },
  "binary": {
    "label": "dr_detected",
    "score": 0.91,
    "calibrated": true
  },
  "severity": {
    "label": "moderate",
    "scores": {
      "no_dr": 0.01,
      "mild": 0.08,
      "moderate": 0.72,
      "severe": 0.16,
      "proliferative": 0.03
    }
  },
  "lesions": {
    "microaneurysm_mask": "protected resource ID",
    "haemorrhage_mask": "protected resource ID",
    "hard_exudate_mask": "protected resource ID"
  },
  "decision": {
    "abstained": false,
    "requires_specialist_review": true
  }
}
```

# Development Roadmap

## Phase 1 — Make the Application Reproducible

1. Add `requirements.txt` or `pyproject.toml`.
2. Pin compatible TensorFlow and Keras versions.
3. Document Python and system dependencies.
4. Create required directories automatically.
5. Provide a verified model-download command.
6. Add model checksums and metadata.
7. Add MongoDB initialization and indexes.
8. Document NLTK resource installation.
9. Add an environment example.
10. Add Docker support where appropriate.

## Phase 2 — Correct the Inference Pipeline

1. Fix tensor dimensions.
2. Verify preprocessing parity with training.
3. Load models once.
4. Remove invalid cached-inference logic.
5. Recompute from the original image or persist structured predictions.
6. Validate output dimensions.
7. Normalize scores consistently.
8. Define a final decision rule.
9. Add image-quality rejection.
10. Add calibrated uncertainty.

## Phase 3 — Medical Validation and Presentation

1. Replace diagnostic marketing claims.
2. Add clear research-use disclaimers.
3. Document intended and excluded use.
4. Add clinician-review requirements.
5. Publish validation metrics.
6. Add external validation.
7. Add subgroup and device analysis.
8. Validate segmentation thresholds.
9. Add out-of-distribution detection.
10. Introduce model cards and data sheets.
11. Establish medical review for chatbot content.

## Phase 4 — Refactor and Test

1. Split the monolithic application into blueprints.
2. Add service and repository layers.
3. Add structured schemas for results.
4. Add centralized error handling.
5. Remove StockSensei remnants.
6. Remove empty and compiled files.
7. Implement automated tests.
8. Add CI with quality checks.
9. Add production WSGI configuration.

# Minimum Automated Test Suite

## Inference

```text
test_preprocessing_shape
test_preprocessing_range
test_binary_model_input_shape
test_segmentation_model_input_shape
test_multi_model_input_shape
test_output_class_count
test_mask_threshold
test_cached_and_fresh_results_match
test_models_loaded_once
test_missing_model_error
test_low_quality_image_rejected
```

## Chatbot

```text
test_nltk_resources_available
test_fallback_for_unknown_question
test_medical_content_has_disclaimer
test_emergency_response
test_chat_creation
test_chat_deletion
test_training_artifact_loading
```

## Packaging and Interface

```text
test_required_directories_created
test_model_manifest_complete
test_database_indexes_created
test_result_template_renders
test_readme_setup_steps
test_inference_api_contract
```

# Repository Hygiene Recommendations

Remove from the repository:

```text
__pycache__/
*.pyc
stale stock-prediction PNGs
empty project remnants
unused global variables
stale finance-related text
```

Consider moving the demo video to a release or external video platform rather than storing it in Git.

Recommended `.gitignore`:

```gitignore
.env
.venv/
venv/
__pycache__/
*.py[cod]
static/uploads/
models/
*.log
.pytest_cache/
.coverage
instance/
```

# Accurate Feature Summary

## Implemented in Source

- Flask authentication pages
- Password hashing
- MongoDB users, chats, and messages
- Binary retinal-analysis route
- Five-class retinal-analysis route
- Three-lesion segmentation route
- Preprocessing with CLAHE and Gaussian filtering
- Result templates and charts
- Neural-network intent chatbot
- Treatment-information intents
- Password-recovery email flow
- Dark/light theme
- Multi-chat interface

## Not Fully Delivered by the Repository

- Runnable DR inference without external models
- Reproducible installation
- Medical inference REST API
- Clinical validation
- Model monitoring
- Automated tests
- Production deployment

# Engineering Skills Demonstrated

- Python web development
- Flask routing and sessions
- Jinja templating
- MongoDB integration
- Password hashing
- File-upload handling
- OpenCV preprocessing
- CLAHE
- Gaussian filtering
- TensorFlow/Keras inference
- Semantic segmentation workflow
- Binary classification
- Multi-class classification
- Lesion-focused modeling
- NLTK text processing
- Bag-of-words classification
- Keras chatbot training
- AJAX
- jQuery
- Interactive result visualization
- Full-stack application integration

# Resume-Ready Description

**Diabetic Retinopathy Detection and Classification Application**

Developed a Flask and MongoDB web application for retinal-image analysis using TensorFlow, Keras, OpenCV, scikit-image, and JavaScript. Built separate workflows for binary diabetic-retinopathy detection, five-class severity grading, and U-Net-based segmentation of microaneurysms, haemorrhages, and hard exudates. Implemented CLAHE enhancement, intensity adjustment, Gaussian filtering, multi-model result visualization, account authentication, persistent chatbot conversations, and an NLTK/Keras intent assistant containing diabetic-retinopathy information.

# Compact Portfolio Description

Flask-based retinal-analysis prototype using **TensorFlow, Keras, OpenCV, scikit-image, MongoDB, NLTK, JavaScript, and AJAX**. Supports binary DR detection, five-class severity classification, segmentation of three retinal lesion types, authentication, result visualization, and a persistent informational chatbot.

# Accurate Project Maturity Statement

> The repository demonstrates an ambitious integration of retinal preprocessing, lesion segmentation, diabetic-retinopathy classification, Flask, MongoDB persistence, and an NLP chatbot. It remains an academic prototype because its medical models are externally hosted and undocumented, the archive is not directly runnable, several inference workflows contain correctness defects, and no clinical-validation evidence is included.
