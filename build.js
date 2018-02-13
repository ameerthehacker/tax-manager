// This script is to build the angular app with the current path as base url

const exec = require("child_process").exec;

// Replace the windows file path slashes to linux style
let filepath = __dirname.replace(/\\/g, "/");

// Add a trailing slash if neccessary
if (!filepath.endsWith("/")) {
  filepath += "/";
}

exec(
  `ng build --prod --base-href=file:///${filepath}electron/app/`,
  (err, stdout, stderr) => {
    if (err) {
      console.log(`ERROR: Unable to build angular app: ${JSON.stringify(err)}`);
    } else {
      console.log("Voila! the angular app is built");
    }
  }
);
