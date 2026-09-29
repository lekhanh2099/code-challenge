import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
 throw new Error("App root element was not found.");
}

createRoot(rootElement).render(
 <Theme
  appearance="light"
  accentColor="indigo"
  grayColor="slate"
  radius="large"
  hasBackground={false}
 >
  <App />
 </Theme>,
);
