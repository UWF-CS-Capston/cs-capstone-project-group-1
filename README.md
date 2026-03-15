<h1>Capstone Project: GymBuddy</h1>
<h2>First Launch</h2>

<p>Before you start you must edit GymBuddy/src/utils/api.ts and change the constant variable COMPUTER_IP and PORT to the local machine's IP address and port number respectively (port should be 5000 on default). You may find that this will be easier if you reserve an IPv4 address on your router so it doesn't change mid development. To clarify you need the IPv4 address of the machine that is running the frontend code. </p>
<p>WARNING THIS IS NOT COMPLETE you probably need to change the IP address in a few files. Ran out of time but in the future will be fixed to just use ENV VAR for each person rather then going in and doing it manually</p>

<p>To get your IPv4 address you may execute the following commands in your terminal depending on your OS: <br>Windows: ipconfig<br>Linux: hostname -I<br>Mac: ifconfig | grep inet | grep -v inet6 | grep -v 127.0.0.1 | awk '{print $2}'</p>

<p>In your first launch, run: npm install, to ensure all packages needed are installed.</p>

<h2>In order to run the app:</h2>

<p> These instructions are for running the app. After app is running, you can click the link to open the web page.</p>

<p><b>Step 1:</b> cd GymBuddy</p>

<p><b>Step 2:</b> npm start </p>

<h2>For Testing</h2>
<p><b>Run: </b>npm test -- --coverage</p>