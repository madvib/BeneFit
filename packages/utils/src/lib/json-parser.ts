import { Result } from '@bene/shared-domain';

/**
 * Extract JSON from text that may contain markdown code blocks or other formatting
 * @param text The text to extract JSON from
 * @returns The extracted JSON string
 */
export function extractJson(text: string): string {
  // Try to extract JSON from markdown code blocks first
  const jsonMarkdownMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMarkdownMatch && jsonMarkdownMatch[1]) {
    return jsonMarkdownMatch[1];
  }

  // Try generic code blocks
  const codeBlockMatch = text.match(/```([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1];
  }

  // Try to find JSON object boundaries
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}') + 1;
  if (jsonStart !== -1 && jsonEnd !== 0 && jsonStart < jsonEnd) {
    return text.substring(jsonStart, jsonEnd);
  }

  // Return as-is if no patterns match
  return text;
}

/**
 * Parse JSON response with error handling and type safety
 * @param text The text containing JSON
 * @returns Result containing the parsed object or error
 */
export function parseJsonResponse<T>(text: string): Result<T> {
  try {
    const jsonText = extractJson(text);
    const parsed = JSON.parse(jsonText) as T;
    return Result.ok(parsed);
  } catch (error) {
    return Result.fail(
      new Error(
        `Failed to parse JSON response: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
}

/**
 * Parse JSON with fallback strategies
 * @param text The text containing JSON
 * @returns Result containing the parsed object or error
 */
export function parseJsonWithFallback<T>(text: string): Result<T> {
  // First attempt: standard parsing
  const standardResult = parseJsonResponse<T>(text);
  if (standardResult.isSuccess) {
    return standardResult;
  }

  // Second attempt: try to clean the text
  try {
    const cleaned = text
      .trim()
      .replace(/^[^{[]*/, '') // Remove leading non-JSON characters
      .replace(/[^}\]]*$/, ''); // Remove trailing non-JSON characters

    const parsed = JSON.parse(cleaned) as T;
    return Result.ok(parsed);
  } catch (error) {
    // Return the original error from standard parsing
    return standardResult;
  }
}
