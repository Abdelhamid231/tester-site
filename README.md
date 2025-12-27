# 🚀 AI Web Tester - Standalone Edition

A fully portable, AI-powered website testing suite that works anywhere without any configuration.

## ✨ Features

- **🎯 Fast UI Test**: Lightning-fast UI stability and performance analysis
- **🛡️ Security Test**: Deep security vulnerability scanning (XSS, SQL injection, etc.)
- **⚡ Enterprise Pro**: Comprehensive QA with accessibility, workflows, and performance metrics
- **📊 Ultra-Granular Reports**: Detailed technical breakdowns with strengths, weaknesses, and expert advice

## 🎮 Quick Start

### Windows
1. Double-click `run.bat`
2. Wait for dependencies to install
3. Browser will open automatically at `http://localhost:5173`

### Manual Start
```bash
# Install backend dependencies
cd ai-web-optimizer-main/backend
pip install -r requirements.txt

# Install frontend dependencies  
cd ..
npm install

# Start backend (in one terminal)
cd backend
python main.py

# Start frontend (in another terminal)
npm run dev
```

## 🔧 Requirements

- **Python 3.8+** - For AI testing engines
- **Node.js 16+** - For the web interface
- **Chrome/Chromium** - For Selenium-based tests
- **Supabase Account** - For authentication and user management

## 🔐 Authentication

This project uses **Supabase** for authentication. Users must:
1. Sign up for an account
2. Subscribe to a plan to access premium tests:
   - **Starter** (Free): Initial Test only
   - **Pro**: Initial + Fast UI + Security tests
   - **Enterprise**: All 4 tests including Enterprise Pro

### Special Admin Access
Three hardcoded admin emails have **free unlimited access** to all tests:
- `djoual.abdelhamid1@gmail.com`
- `abdorenouni@gmail.com`
- `mohammedbouzidi25@gmail.com`

See [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed access control documentation.

## ⚙️ Setup for Deployment

1. Create a Supabase project at https://supabase.com
2. Run the migrations in `ai-web-optimizer-main/supabase/migrations/`
3. Create `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Deploy or run locally with `run.bat`

## 💡 Usage

1. Open the web interface at `http://localhost:5173`
2. **Sign up** or **Sign in** with your account
3. Select a test type based on your subscription:
   - **Initial Test**: Available to all users (free)
   - **Fast UI Test**: Requires Pro or Enterprise plan
   - **Security Test**: Requires Pro or Enterprise plan
   - **Enterprise Pro**: Requires Enterprise plan
4. Enter any website URL
5. Click "ANALYZE" and wait for results

**Note**: The 3 special admin emails have automatic access to all tests without payment.

## 📁 Project Structure

```
tester-site/
├── run.bat                    # One-click launcher (Windows)
├── V3/                        # AI testing engines
│   ├── simple_ui_test/       # Fast UI tester
│   ├── security test/        # Security scanner
│   └── pro testing/          # Enterprise QA
└── ai-web-optimizer-main/    # Web interface
    ├── backend/              # FastAPI server
    │   ├── main.py          # API endpoints
    │   ├── automation_wrapper.py  # V3 integration
    │   └── requirements.txt
    └── src/                  # React frontend
```

## 🐛 Troubleshooting

### Backend won't start
- Make sure Python is installed: `python --version`
- Install dependencies: `pip install -r backend/requirements.txt`
- Check port 8000 is not in use

### Frontend won't start
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check port 5173 is not in use

### Tests fail
- Ensure Chrome/Chromium is installed
- Check your internet connection (needed for testing external sites)
- Try running with `python main.py` directly to see error messages

## 📝 Notes

- First run may take a few minutes to install dependencies
- Tests run in headless Chrome (no browser window appears)
- Results are displayed in real-time in the web interface
- No data is saved - each test is independent

## 🎯 Perfect For

- ✅ Sharing with team members
- ✅ Running on client machines
- ✅ Offline/air-gapped environments
- ✅ Quick demos and presentations
- ✅ Educational purposes

---

**Made with ❤️ using AI-powered testing engines**
