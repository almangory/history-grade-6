/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function handler(req: any, res: any) {
  const isKeyAvailable = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  return res.status(200).json({
    status: "ok",
    geminiAvailable: isKeyAvailable,
  });
}
