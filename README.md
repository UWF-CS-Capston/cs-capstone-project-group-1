<h1>Capstone Project: GymBuddy</h1>
<h2>CAPSTONE STAGE ONE VIDEO</h2>

<p>link to youtube video: https://youtu.be/ga09kVtvHNQ</p>

<h2>After Cloning the Repository</h2>

<p><b>Step 1:</b> Navigate to the project folder</p>
<p>cd cs-capstone-project-group-1</p>

<p><b>Step 2:</b> Install root dependencies</p>
<p>npm install</p>

<p><b>Step 3:</b> Install frontend and backend dependencies</p>
<p>npm run install-all</p>

<p><b>Step 4 (Windows Only):</b> If npm scripts are blocked in PowerShell, run this once</p>
<p>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</p>

<h2>Environment Setup</h2>

<p><b>Backend (.env):</b> Create a <b>.env</b> file inside the <b>Backend</b> folder using <b>.env.example</b> as a template.</p>

<p>Copy from Backend/.env.example and update as needed:</p>
<pre>
PORT=5001
JWT_SECRET=your-secret-here
PGHOST=localhost
PGPORT=5000
PGUSER=postgres
PGPASSWORD=your_actual_postgresql_password
PGDATABASE=gymbuddy
</pre>

<p><b>IMPORTANT:</b> The backend API runs on port <b>5001</b>.</p>
<p><b>IMPORTANT:</b> PostgreSQL is configured to run on port <b>5000</b>, not the default 5432.</p>
<p><b>IMPORTANT:</b> Replace <code>PGPASSWORD</code> with your actual PostgreSQL password. The backend will not connect without valid credentials.</p>
<p><b>IMPORTANT:</b> The backend will not start without a valid <b>.env</b> file.</p>

<p><b>Database Setup:</b> The backend automatically creates the database if it does not already exist, then initializes the required tables and seed data on startup.</p>

<p><b>Network Configuration:</b> All network settings (IPs, ports) are in <b>GymBuddy/src/config/network.config.ts</b></p>

<h2>First Launch</h2>

<p><b>Network Configuration:</b> Before starting:</p>

<p><b>Quick Setup (3 steps):</b></p>
<ol>
  <li>Find your computer's IP address (see commands below)</li>
  <li>Edit <b>GymBuddy/src/config/network.config.ts</b></li>
  <li>Update the <code>COMPUTER_IP</code> value with your IP address</li>
</ol>

<p>To get your IPv4 address you may execute the following commands in your terminal depending on your OS: <br>Windows: ipconfig<br>Linux: hostname -I<br>Mac: ifconfig | grep inet | grep -v inet6 | grep -v 127.0.0.1 | awk '{print $2}'</p>

<h2>Running the Application</h2>

<p><b>Step 1:</b> Make sure you are in the root project folder</p>
<p>cd cs-capstone-project-group-1</p>

<p><b>Step 2:</b> Start the entire application (frontend + backend)</p>
<p>npm run dev</p>

<p>The backend and frontend will start automatically.</p>

<p><b>Note:</b> Make sure PostgreSQL is running before starting the application.</p>

<h2>Running Tests</h2>

<p><b>Run all tests:</b></p>
<p>npm test</p>

<p><b>Run tests with coverage:</b></p>
<p>npm test -- --coverage</p>

<h2>If You Get JWT_SECRET Errors During Testing</h2>

<p>Run tests with a temporary secret:</p>

<p>$env:JWT_SECRET="test-secret"; npm test</p>