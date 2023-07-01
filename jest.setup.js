// Used for __tests__/testing-library.js
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
configure({ asyncUtilTimeout: 400 });
