const RE_WHITESPACE = /\s+/;

/**
 * Parse the output of `ollama list` and check whether a model is present.
 *
 * `ollama list` prints lines like:
 *   llama3.2-vision:latest  a70ff7e570d9  7.9 GB  2 hours ago
 *
 * We match by checking if any data line starts with `modelName` (with or
 * without an explicit `:tag` suffix on either side).
 */
export function isModelInList(listOutput: string, modelName: string): boolean {
	const lines = listOutput.split("\n").slice(1); // skip header
	const baseName = modelName.split(":")[0];

	for (const line of lines) {
		const entry = line.trim().split(RE_WHITESPACE)[0]; // first column = NAME
		if (!entry) {
			continue;
		}
		const entryBase = entry.split(":")[0];
		if (entry === modelName || entryBase === baseName) {
			return true;
		}
	}
	return false;
}
