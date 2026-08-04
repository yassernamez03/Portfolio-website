# Diabetic Retinopathy Detection and Classification — Project Overview

**Repository:** [yassernamez03/Diabetic-Retinopathy-Detection-and-Classification](https://github.com/yassernamez03/Diabetic-Retinopathy-Detection-and-Classification)

## Overview

This project explores the automated detection and severity classification of **diabetic retinopathy from retinal fundus images** using computer vision and deep learning.

The implementation combines three related workflows:

1. Retinal-image preprocessing and enhancement
2. Lesion segmentation with a custom U-Net
3. Binary and five-class classification with transfer learning

A central research objective is to compare classification from original retinal images with classification from images focused on clinically relevant lesions such as **microaneurysms, haemorrhages, and hard exudates**.

The project is implemented as a collection of GPU-enabled Kaggle notebooks rather than a deployed web application.

> This is an academic computer-vision prototype and is not a clinically validated diagnostic system.

## Repository Structure

```text
Diabetic-Retinopathy-Detection-and-Classification/
├── README.md
├── data-pre-processing.ipynb
├── segmentation-models.ipynb
├── dr-binary-classification-segmentation.ipynb
└── dr-multi-classification-segmentation.ipynb
```

### `data-pre-processing.ipynb`

Explores retinal-image preparation, enhancement, and feature extraction before model training.

### `segmentation-models.ipynb`

Implements lesion-segmentation workflows with a custom U-Net architecture and annotated retinal masks.

### `dr-binary-classification-segmentation.ipynb`

Experiments with binary diabetic-retinopathy classification using original and lesion-segmented retinal images.

### `dr-multi-classification-segmentation.ipynb`

Extends the classification workflow to five diabetic-retinopathy severity categories.

## Main Project Features

### Retinal Image Preprocessing

The notebooks prepare fundus images for neural-network training through several image-processing steps:

- Resizing images to fixed dimensions
- RGB and grayscale conversion
- Green-channel extraction to improve retinal lesion visibility
- Pixel-value normalization
- Contrast enhancement with CLAHE
- Gamma-based intensity adjustment
- Gaussian noise filtering
- Conversion to NumPy arrays for model input

The preprocessing notebook uses **224 × 224** images for initial experiments, while the segmentation and classification notebooks primarily use **512 × 512** images.

### Data Augmentation

The classification workflow includes image augmentation to increase training variation and reduce sensitivity to image orientation.

Implemented transformations include:

- Random horizontal flipping
- Small image rotations
- Small affine shearing transformations

### Lesion Segmentation

The project implements semantic segmentation for retinal abnormalities associated with diabetic retinopathy.

The targeted lesion types include:

- **Microaneurysms**
- **Haemorrhages**
- **Hard exudates**

The workflow loads retinal images and their corresponding binary masks, resizes them to a common resolution, preprocesses the image channels, and trains segmentation models to isolate lesion regions.

### Custom U-Net Architecture

A U-Net-style convolutional neural network is constructed directly with TensorFlow/Keras.

Its architecture contains:

- Repeated convolutional blocks
- Batch normalization
- ReLU activation
- Max-pooling encoder stages
- A high-capacity bridge layer
- Transposed-convolution upsampling
- Encoder-to-decoder skip connections
- A one-channel sigmoid segmentation output

This structure allows the model to preserve spatial information while learning detailed lesion masks.

### Binary Classification

The binary-classification notebook investigates whether retinal images show diabetic-retinopathy-related findings.

The experiment compares classification performance using:

- Original retinal images
- Microaneurysm-focused segmentation
- Haemorrhage-focused segmentation
- Hard-exudate-focused segmentation

A single sigmoid output is used for binary prediction.

### Multi-Class Severity Classification

The multi-class notebook predicts one of five diagnostic classes based on the APTOS grading labels.

The five-level task represents progression from the absence of diabetic retinopathy to increasingly advanced disease severity.

The experiment again compares:

- Original images
- Microaneurysm-segmented images
- Haemorrhage-segmented images
- Hard-exudate-segmented images

A five-unit classification head is used for the severity-grading task.

### Transfer Learning with EfficientNet

The principal classification architecture is based on **EfficientNetB3** with ImageNet weights.

The implemented model includes:

1. A single-channel image input
2. A convolutional layer that adapts the input to three channels
3. An EfficientNetB3 feature extractor without its original classifier
4. Global average pooling
5. Flattening
6. Dropout regularization
7. A 512-unit dense layer
8. A task-specific binary or five-class output layer

The notebooks also import other pretrained architectures—including **InceptionV3, DenseNet121, and ResNet50**—indicating support for architecture comparison and experimentation.

### Model Training Controls

The project uses standard deep-learning training practices, including:

- Training and validation splitting
- Adam optimization
- Binary and categorical cross-entropy losses
- Model checkpointing
- Early stopping
- Learning-rate reduction when training plateaus
- GPU-enabled Kaggle execution

### Model Evaluation

The implementation includes tools for evaluating both binary and multi-class models.

Available evaluation measures include:

- Accuracy
- Precision
- Recall
- F1 score
- Classification reports
- Confusion matrices
- ROC curves
- Area under the ROC curve

The notebooks also use Matplotlib and Seaborn for visual comparison of images, masks, model behavior, and evaluation outputs.

## Datasets

### APTOS 2019 Blindness Detection

Used for retinal-image classification and diabetic-retinopathy severity grading.

The dataset provides:

- Retinal fundus photographs
- Image identifiers
- Diagnostic severity labels
- Five diabetic-retinopathy grading levels

### IDRiD 2018

Used for lesion-segmentation experiments.

The project reads annotated training and testing masks for:

- Microaneurysms
- Haemorrhages
- Hard exudates

## Experimental Workflow

```text
Retinal Fundus Images
        │
        ▼
Image Loading and Resizing
        │
        ▼
CLAHE, Gamma Adjustment and Gaussian Filtering
        │
        ├───────────────────────────┐
        ▼                           ▼
Original-Image Pipeline       U-Net Segmentation
                                    │
                                    ▼
                         Lesion-Focused Images
                                    │
        ┌───────────────────────────┘
        ▼
Data Augmentation and Train/Validation Split
        │
        ▼
EfficientNetB3 Transfer Learning
        │
        ├── Binary DR Classification
        └── Five-Class Severity Classification
        │
        ▼
Accuracy, Precision, Recall, F1, Confusion Matrix and ROC/AUC
```

## Technology Stack

### Programming and Notebook Environment

- Python
- Jupyter Notebook
- Kaggle Notebooks
- GPU-accelerated model training

### Deep Learning

- TensorFlow
- Keras
- EfficientNetB3
- U-Net
- Transfer learning
- Convolutional neural networks

### Image Processing

- OpenCV
- scikit-image
- Pillow
- imgaug

### Data and Evaluation

- NumPy
- Pandas
- scikit-learn
- Matplotlib
- Seaborn

## Engineering and Research Highlights

- Combines lesion segmentation and disease classification in one experimental pipeline
- Implements a U-Net architecture directly rather than relying only on a packaged segmentation model
- Compares original retinal images against three lesion-focused image variants
- Supports both binary screening and five-class severity grading
- Uses ImageNet transfer learning to reduce the data requirements of medical-image classification
- Applies retinal-specific contrast and noise preprocessing
- Includes augmentation, training callbacks, and several evaluation metrics
- Separates preprocessing, segmentation, binary classification, and multi-class classification into dedicated notebooks

## Skills Demonstrated

- Medical-image analysis
- Computer vision
- Deep learning
- Convolutional neural networks
- U-Net segmentation
- Transfer learning
- EfficientNet
- TensorFlow and Keras
- OpenCV image processing
- Data augmentation
- Binary classification
- Multi-class classification
- Model evaluation
- NumPy and Pandas
- Experimental design with Kaggle datasets
- Visualization with Matplotlib and Seaborn

## Resume-Ready Description

**Diabetic Retinopathy Detection and Classification**

Developed a deep-learning pipeline for retinal fundus-image analysis using TensorFlow, Keras, OpenCV, and scikit-image. Implemented CLAHE-based preprocessing, gamma adjustment, Gaussian filtering, and image augmentation; built a custom U-Net to segment microaneurysms, haemorrhages, and hard exudates using IDRiD annotations; and used EfficientNetB3 transfer learning for binary detection and five-class severity classification on the APTOS 2019 dataset. Evaluated models with accuracy, precision, recall, F1 score, confusion matrices, and ROC/AUC analysis.

## Compact Portfolio Description

Computer-vision project for diabetic-retinopathy analysis using **TensorFlow, Keras, EfficientNetB3, U-Net, OpenCV, and scikit-image**. The pipeline preprocesses retinal images, segments key lesions, and compares original and lesion-focused inputs for binary detection and five-class severity classification.
