import { describe, expect, test } from "bun:test";
import { isModelInList } from "./ollama-utils";

describe("isModelInList", () => {
	const sampleList = `NAME                    ID              SIZE      MODIFIED
llama3.2-vision:latest  a70ff7e570d9    7.9 GB    2 hours ago
llava:latest            8dd30f6b0cb1    4.7 GB    3 days ago`;

	test("returns true when exact model name matches", () => {
		expect(isModelInList(sampleList, "llama3.2-vision")).toBe(true);
	});

	test("returns true when model with tag matches", () => {
		expect(isModelInList(sampleList, "llava:latest")).toBe(true);
	});

	test("returns false when model not present", () => {
		expect(isModelInList(sampleList, "mistral")).toBe(false);
	});

	test("returns false for empty list output", () => {
		expect(isModelInList("", "llama3.2-vision")).toBe(false);
	});

	test("returns false when list has only header", () => {
		const headerOnly =
			"NAME                    ID              SIZE      MODIFIED";
		expect(isModelInList(headerOnly, "llama3.2-vision")).toBe(false);
	});

	test("matches model name prefix (without tag) when list entry has :latest", () => {
		expect(isModelInList(sampleList, "llava")).toBe(true);
	});
});
