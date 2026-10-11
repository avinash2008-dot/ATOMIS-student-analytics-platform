# ATOMIS – Predict. Support. Succeed.

<p align="center">
  <img src="./public/atomis-icon.svg" width="110" alt="ATOMIS Logo" />
  <br />
  <strong>Predict. Support. Succeed.</strong>
  <br />
  <em>Student Analytics & Success Platform</em>
</p>

ATOMIS is an enterprise-grade higher education analytics and student success intelligence engine. It transforms raw, fragmented campus records into unified 360° student passports, automated early dropout risk diagnostics, explainable scores, and actionable faculty interventions.

---

## 🏗 System Architecture & Directory Structure

```
├── /src
│   ├── /landing               # Part A: Landing Page & 3D Experience
│   │   ├── HeroCubes.tsx      # Rotating 4x4x4 translucent blue glass cubes (three.js)
│   │   ├── AtomScrollScene.tsx# 1,800 particle sphere splitting into 10 atoms (three.js)
│   │   └── LandingPage.tsx    # Premium landing page + secure role-based login portal
│   │
│   ├── /data                  # Data Pipeline & Integration Layer
│   │   ├── studentTypes.ts    # Schemas for 7 raw source tables & unified student profiles
│   │   ├── syntheticDataGenerator.ts # Reproducible generator (seeded PRNG, realistic correlations)
│   │   └── dataIntegrationPipeline.ts # ETL merge: deduplication, median imputation, outlier capping, 0-100 normalization
│   │
│   ├── /lib                   # Pure Functional Analytics & Decision Intelligence
│   │   ├── scoring.ts         # Weighted Success Score formula & live customizer
│   │   ├── riskEngine.ts      # Logistic regression & rule-based academic/placement risk engine
│   │   ├── segmentation.ts    # k=5 behavioral student clustering rules
│   │   └── explainability.ts  # Waterfall point contributions & natural-language explanations
│   │
│   ├── /components            # Shared UI Components & Modals
│   │   ├── DashboardLayout.tsx# Sidebar, sticky filter bar, role switcher, dark mode toggle
│   │   ├── StudentProfileDrawer.tsx # 360° drawer with radar chart & explainability waterfall
│   │   ├── ScoreExplainerModal.tsx # "How the Success Score Works" transparency modal
│   │   ├── DemoTourModal.tsx  # 5-step interactive guided presentation tour
│   │   └── AskAnalystChat.tsx # Gemini AI / template analyst assistant
│   │
│   └── /pages                 # Part B: Interactive Dashboard Pages
│       ├── OverviewPage.tsx   # Executive KPIs, score histogram, department comparisons, risk heatmap
│       ├── StudentsPage.tsx   # Searchable, filterable, sortable student directory
│       ├── SegmentsPage.tsx   # 2D scatter plot (academic vs placement) & segment cards
│       ├── InsightsPage.tsx   # Auto-generated predictive insights & Pearson correlation matrix
│       ├── InterventionsPage.tsx # Remedial action tracker with bulk faculty assignment
│       ├── DataIntegrationPage.tsx # Pipeline flow diagram, before/after data quality report, CSV upload
│       └── ScoreSettingsPage.tsx # Live weight customizer sliders with instant recalculation
```

---

## 🧮 Student Success Score Formula

The Student Success Score is a transparent, composite metric normalized to a 0–100 scale:

$$\text{Success Score} = \sum_{i} (w_i \times \text{Normalized}_i)$$

### Default Indicator Weights:
- **Academic Performance (35%)**: Combines CGPA ($0-10 \to 60\text{ pts}$), internal marks ($0-50 \to 20\text{ pts}$), exam marks ($0-100 \to 20\text{ pts}$), and subtracts an active backlog penalty ($-8\text{ pts}$ per backlog).
- **Classroom Attendance (15%)**: Biometric attendance percentage with a steep decline below the 75% cutoff.
- **LMS Engagement (15%)**: Weekly portal logins, digital assignment completion %, and video content views.
- **Placement Readiness (15%)**: Technical coding benchmark (40%), aptitude test speed (35%), and mock interview score (25%).
- **Campus Engagement (10%)**: Club memberships, event participation, hackathons, and certifications.
- **Technical & Soft Skills (5%)**: Practical lab assessments (65%) and communication skills (35%).
- **Student & Faculty Feedback (5%)**: Normalized course satisfaction and faculty appraisals.

### Classification Bands:
- **80 – 100**: Thriving
- **60 – 79**: On Track
- **40 – 59**: Needs Attention
- **< 40**: Critical Risk

---

## 🔄 Data Integration & Cleaning Pipeline

The platform ingests records from 7 isolated campus source tables:
1. **Academic Records** (CGPA, marks, backlogs, subject coursework)
2. **Biometric Attendance** (overall and course-wise percentages)
3. **LMS Telemetry** (logins, submissions, content views)
4. **Campus Engagement** (hackathons, clubs, certifications)
5. **Placement Cell** (coding benchmarks, aptitude, interviews)
6. **Skills Assessment** (technical lab viva, soft skills)
7. **Feedback & Appraisals** (satisfaction, faculty ratings)

### Cleaning Steps Applied:
1. **Deduplication**: Records are indexed and deduplicated by `student_id`.
2. **Median Imputation**: Null and missing values (~5%) are imputed using departmental medians.
3. **Outlier Capping**: Out-of-bounds readings (e.g., attendance >100% or CGPA >10.0) are capped.
4. **0–100 Dimensional Normalization**: Maps diverse scales into standard comparable dimensions.

---

## 🔌 How to Plug in Real Campus Data

1. **Direct CSV Upload**:
   Navigate to the **Data Integration** tab in the dashboard and use the **Upload CSV** button corresponding to each source table. The system automatically parses headers and validates against the schema.
2. **REST API Ingestion**:
   Send batches of JSON payloads matching the interfaces in `/src/data/studentTypes.ts` to `/api/students/import-batch`.
3. **Database Connector**:
   Replace `generateSyntheticDataset()` in `/src/App.tsx` with your database client (PostgreSQL / MySQL / Firestore) query returning the raw source tables.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile and check type safety
npm run lint
```
