import { execSync } from "child_process";

try {
  console.log("Checking git status:");
  const status = execSync("git status", { encoding: "utf8" });
  console.log(status);
  
  console.log("Checking git diff of src/data.ts:");
  const diff = execSync("git diff src/data.ts", { encoding: "utf8" });
  console.log(diff);
} catch (e: any) {
  console.error("Error executing git:", e.message);
}
