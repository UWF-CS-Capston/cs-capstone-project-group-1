<h1>Capstone Project: GymBuddy</h1>
<h2>CAPSTONE STAGE ONE VIDEO</h2>

<p>link to youtube video: https://youtu.be/ga09kVtvHNQ</p>

<h2>First Launch</h2>

<p>⚙️ <b>Network Configuration:</b> All IP addresses and port numbers are now centralized! Before starting:</p>

<p><b>Quick Setup (3 steps):</b></p>
<ol>
  <li>Find your computer's IP address (see commands below)</li>
  <li>Edit <b>GymBuddy/src/config/network.config.ts</b></li>
  <li>Update the <code>COMPUTER_IP</code> value with your IP address</li>
</ol>


<p>To get your IPv4 address you may execute the following commands in your terminal depending on your OS: <br>Windows: ipconfig<br>Linux: hostname -I<br>Mac: ifconfig | grep inet | grep -v inet6 | grep -v 127.0.0.1 | awk '{print $2}'</p>

<p>In your first launch, run: npm install, to ensure all packages needed are installed.</p>

<h2>In order to run the app:</h2>

<p> These instructions are for running the app. After app is running, you can click the link to open the web page.</p>

<p><b>Step 1:</b> cd GymBuddy</p>

<p><b>Step 2:</b> npm start </p>

<h2>For Testing</h2>
<p><b>Run: </b>npm test -- --coverage</p>

<h2>After Cloning the Repository</h2>

<p><b>Step 1:</b> Navigate to the project folder</p>
<p>cd cs-capstone-project-group-1</p>

<p><b>Step 2:</b> Install root dependencies</p>
<p>npm install</p>

<p><b>Step 3:</b> Enter the GymBuddy folder</p>
<p>cd GymBuddy</p>

<p><b>Step 4:</b> Install GymBuddy dependencies</p>
<p>npm install</p>

<p><b>Step 5 (Windows Only):</b> If npm scripts are blocked in PowerShell, run this once</p>
<p>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</p>


<h2>Environment Setup</h2>

<p><b>Backend (.env):</b> Create a <b>.env</b> file inside the <b>Backend</b> folder using <b>.env.example</b> as a template.</p>

<p>Copy from Backend/.env.example and update as needed:</p>
<pre>
PORT=5000
JWT_SECRET=your-secret-here
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=change_this_password
PGDATABASE=gymbuddy
</pre>

<p><b>Network Configuration:</b> All network settings (IPs, ports) are in <b>GymBuddy/src/config/network.config.ts</b></p>




<h2>Running the App</h2>

<p><b>Step 1:</b> Make sure you are inside the GymBuddy folder</p>
<p>cd GymBuddy</p>

<p><b>Step 2:</b> Start the application</p>
<p>npm start</p>

<p>After the server starts, open the link shown in the terminal.</p>


<h2>Running the Backend in Development Mode</h2>

<p>npm run dev</p>


<h2>Running Tests</h2>

<p><b>Run all tests:</b></p>
<p>npm test</p>

<p><b>Run tests with coverage:</b></p>
<p>npm test -- --coverage</p>


<h2>If You Get JWT_SECRET Errors During Testing</h2>

<p>Run tests with a temporary secret:</p>

<p>$env:JWT_SECRET="test-secret"; npm test</p>
