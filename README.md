<h1>Capstone Project: GymBuddy</h1>

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

<p>Create a <b>.env</b> file inside the GymBuddy folder.</p>

<p>Add the following line:</p>

<p>JWT_SECRET=test-secret</p>


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