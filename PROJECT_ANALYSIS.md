# 🎯 AI Modification Guide: rawfin_tv

```json-chart
{
  "type": "project-overview",
  "data": {
    "totalFiles": 6,
    "coreFiles": 0,
    "totalFunctions": 0,
    "totalClasses": 0,
    "totalDependencies": 0,
    "hasTests": false,
    "type": "Unknown",
    "primaryLanguage": "Unknown",
    "frameworks": []
  }
}
```

## 📊 Project Snapshot
- **Type:** Unknown
- **Language:** Unknown
- **Architecture:** Monolithic
- **Files:** 6 total | **Core:** 0 | **Has Tests:** ❌
- **Functions:** 0 | **Classes:** 0
- **Last Analyzed:** Fri, 19 Dec 2025 19:19:57 GMT

---

## 📂 Complete Directory Structure

```
rawfin_tv/
├── .env
├── .gitignore
├── functions/
│   └── .env
├── index.html
└── pages/
    ├── privacy.html
    └── terms.html
```

## ⚡ Quick Context Map

| Category | Count | Avg Complexity | Pattern |
|----------|-------|----------------|----------|
| Other | 4 | 1 | Standard pattern |
| Views | 2 | 0 | Standard pattern |

---

## 📁 Complete File Index (6 files)

```json-chart
{
  "type": "file-index-summary",
  "riskDistribution": {
    "labels": [
      "Critical",
      "Moderate",
      "Safe"
    ],
    "values": [
      0,
      0,
      6
    ],
    "colors": [
      "#f48771",
      "#cca700",
      "#89d185"
    ]
  },
  "categoryDistribution": {
    "labels": [
      "Other",
      "Views"
    ],
    "values": [
      4,
      2
    ]
  }
}
```

### 🟢 Safe Files (6) - Low Impact
*Modify independently. Minimal context needed.*

| Category | Count | Example |
|----------|-------|----------|
| Other | 4 | `index.html` |
| Views | 2 | `pages/privacy.html` |

---

## 📋 Detailed File Breakdown

*Complete inventory of all files with their functions, classes, and purposes.*

### 📂 Other (4 files)

<details>
<summary><strong>index.html</strong> - This is the main HTML entry point for the Rawfin web application, defining th...</summary>

**Purpose:** This is the main HTML entry point for the Rawfin web application, defining the basic structure, metadata, and inline CSS for a landing page. It includes a header, a hero section with a title and description, a call-to-action button, and a footer with legal links, all styled using the Inter font.

**Metrics:**
- Complexity: 2
- Lines: 153
- Dependents: 0
- Dependencies: 0

**When to Modify:**
- Safe to modify independently

</details>

<details>
<summary><strong>.env</strong> - This file contains frontend environment configuration variables, including th...</summary>

**Purpose:** This file contains frontend environment configuration variables, including the Telegram bot username and the base API URL, intended for public use and safe for version control. It utilizes VITE for defining these variables.

**Metrics:**
- Complexity: 0
- Lines: 9
- Dependents: 0
- Dependencies: 0

**When to Modify:**
- Safe to modify independently

</details>

<details>
<summary><strong>.gitignore</strong> - This file specifies intentionally untracked files that Git should ignore, pri...</summary>

**Purpose:** This file specifies intentionally untracked files that Git should ignore, primarily focusing on excluding environment variable files like `.env` and `.env.*` to prevent sensitive information from being committed.

**Metrics:**
- Complexity: 0
- Lines: 5
- Dependents: 0
- Dependencies: 0

**When to Modify:**
- Safe to modify independently

</details>

<details>
<summary><strong>functions/.env</strong> - This file holds sensitive backend environment configuration, including OAuth ...</summary>

**Purpose:** This file holds sensitive backend environment configuration, including OAuth credentials for Twitter, GitHub, and Facebook, as well as API keys and tokens for Telegram, and encryption keys. It is explicitly marked as not to be committed to version control.

**Metrics:**
- Complexity: 0
- Lines: 25
- Dependents: 0
- Dependencies: 0

**When to Modify:**
- Safe to modify independently

</details>

### 📂 Views (2 files)

<details>
<summary><strong>pages/privacy.html</strong> - This file is intended to be a new HTML file that will contain the privacy pol...</summary>

**Purpose:** This file is intended to be a new HTML file that will contain the privacy policy content for the Rawfin website. Its primary purpose is to provide legal information to users regarding data handling and privacy practices.

**Metrics:**
- Complexity: 0
- Lines: 1
- Dependents: 0
- Dependencies: 0

**When to Modify:**
- Safe to modify independently

</details>

<details>
<summary><strong>pages/terms.html</strong> - This HTML file will serve as the user-facing page for displaying the terms an...</summary>

**Purpose:** This HTML file will serve as the user-facing page for displaying the terms and conditions of service for the application. It will likely contain legal text and formatting to ensure readability.

**Metrics:**
- Complexity: 0
- Lines: 1
- Dependents: 0
- Dependencies: 0

**When to Modify:**
- Safe to modify independently

</details>

## 🔗 Dependency Graph

*No significant dependency chains detected.*

---

## 🎯 AI Decision Tree for File Selection

```
START: User requests a feature/change
    │
    ├─ Is it text/copy related? (labels, messages)
    │  ├─ YES → MODIFY: localization files
    │  │        CONSIDER: UI components (if logic changes)
    │  └─ NO  → Continue ↓
    │
    └─ Is it a new feature? (new functionality)
       ├─ YES → CREATE: New module/component
       │        UPDATE: Entry points and dependencies
       └─ NO  → Ask for clarification
```

### 📋 Context Selection Rules

**Rule 1: Always Include Core Files**
```
IF modifying ANY file
THEN include these high-impact files:
```

**Rule 2: Include Dependency Chain**
```
IF modifying file with 5+ dependents
THEN include ALL dependents (see Dependency Graph)
```

## 📚 Modification Patterns

*No specific patterns detected. Follow standard practices for this language.*

---

## 🔧 Project-Specific Commands

## 🔍 Quick Reference: File Purposes

| File | Purpose | When to Include |
|------|---------|------------------|
| `index.html` | Other | When directly modifying |
| `.env` | Other | When directly modifying |
| `.gitignore` | Other | When directly modifying |
| `.env` | Other | When directly modifying |
| `privacy.html` | User interface | When directly modifying |
| `terms.html` | User interface | When directly modifying |

---

## 🛡️ Security Checklist

**General Rules:**
- ✅ When creating files → Validate all file paths
- ✅ When accepting user input → Use validation utilities
- ✅ When modifying authentication → Include security files
- ✅ When handling sensitive data → Review security implications

---

