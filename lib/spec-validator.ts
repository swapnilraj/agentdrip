import fs from 'fs';
import type { ValidationResult } from './types.js';

const REQUIRED_SECTIONS = [
  'Philosophy',
  'The "No" List',
  'Design Tokens',
  'CSS Enforcers',
  'Signature Moves',
  'Responsive Behavior',
  'DO List',
  'Anti-patterns',
  'Reference Snippet',
];

const REQUIRED_SUBSECTIONS = ['Colors', 'Typography', 'Spacing'];

export function validateSkillFile(filePath: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: ['File does not exist: ' + filePath], warnings: [] };
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check required sections
  for (const section of REQUIRED_SECTIONS) {
    const pattern = new RegExp(`^##\\s+${escapeRegex(section)}`, 'm');
    if (!pattern.test(content)) {
      errors.push(`Missing required section: "${section}"`);
    }
  }

  // Check required subsections under Design Tokens
  for (const sub of REQUIRED_SUBSECTIONS) {
    const pattern = new RegExp(`^###\\s+${escapeRegex(sub)}`, 'm');
    if (!pattern.test(content)) {
      errors.push(`Missing required subsection: "${sub}" under Design Tokens`);
    }
  }

  // Check colors have exactly one hex value (no "or" alternatives)
  const colorsSection = extractSection(content, '### Colors', /^##[#]?\s/);
  if (colorsSection) {
    const colorLines = colorsSection.split('\n').filter(l => l.match(/--\w+.*#[0-9A-Fa-f]{3,8}/));
    for (const line of colorLines) {
      const hexMatches = line.match(/#[0-9A-Fa-f]{3,8}/g);
      if (hexMatches && hexMatches.length > 1) {
        errors.push(`Color token has multiple hex values (must be exactly one): "${line.trim()}"`);
      }
      if (/\bor\b/i.test(line) && hexMatches) {
        errors.push(`Color token contains "or" alternative: "${line.trim()}"`);
      }
    }
  }

  // Check signature moves count
  const sigSection = extractSection(content, '## Signature Moves', /^## /);
  if (sigSection) {
    const moveHeaders = sigSection.match(/^###\s+.+/gm) || [];
    // Also count numbered items or bold headers as moves
    const numberedMoves = sigSection.match(/^\d+\.\s+\*\*.+\*\*/gm) || [];
    const totalMoves = Math.max(moveHeaders.length, numberedMoves.length);
    if (totalMoves < 3) {
      // Try counting by code blocks as proxy
      const codeBlocks = sigSection.match(/```css/g) || [];
      if (codeBlocks.length < 3) {
        warnings.push(`Signature Moves section should have at least 3 moves (found ~${Math.max(totalMoves, codeBlocks.length)})`);
      }
    }
  }

  // Check reference snippet is a complete HTML document
  const refSection = extractSection(content, '## Reference Snippet', /^## /);
  if (refSection) {
    if (!refSection.includes('<!DOCTYPE html>') && !refSection.includes('<!doctype html>')) {
      errors.push('Reference Snippet must be a complete HTML document with <!DOCTYPE html>');
    }
    if (!refSection.includes('<html')) {
      errors.push('Reference Snippet must contain an <html> tag');
    }
    if (!refSection.includes('</html>')) {
      errors.push('Reference Snippet must contain a closing </html> tag');
    }
  } else if (!errors.some(e => e.includes('Reference Snippet'))) {
    errors.push('Reference Snippet section is empty');
  }

  // Check for contradictions between No list and Signature Moves
  const noSection = extractSection(content, '## The "No" List', /^## /);
  if (noSection && sigSection) {
    const noItems = noSection.split('\n').filter(l => /^\s*[-*]\s*NO\b/i.test(l));
    for (const noItem of noItems) {
      const lower = noItem.toLowerCase();
      // Extract the CSS property/concept being banned
      const propertyMatch = lower.match(/no\s+([\w-]+(?:\s+[\w-]+)?)/i);
      if (!propertyMatch) continue;
      const banned = propertyMatch[1];

      // Skip if the no-item has an explicit exception
      if (/exception|unless|except/i.test(noItem)) continue;

      // Check if signature moves use the banned thing
      const sigLower = sigSection.toLowerCase();
      if (banned.includes('border-radius') && sigLower.includes('border-radius')) {
        errors.push(`Contradiction: No list bans "${banned}" but Signature Moves uses border-radius`);
      }
      if (banned.includes('box-shadow') && sigLower.includes('box-shadow')) {
        errors.push(`Contradiction: No list bans "${banned}" but Signature Moves uses box-shadow`);
      }
      if (banned.includes('gradient') && sigLower.includes('gradient')) {
        errors.push(`Contradiction: No list bans "${banned}" but Signature Moves uses gradients`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

function extractSection(content: string, heading: string, nextHeadingPattern: RegExp): string | null {
  const escaped = escapeRegex(heading);
  const match = content.match(new RegExp(`^${escaped}\\b.*$`, 'm'));
  if (!match || match.index === undefined) return null;

  const start = match.index + match[0].length;
  const rest = content.slice(start);
  const nextMatch = rest.match(new RegExp(`^${nextHeadingPattern.source}`, 'm'));
  if (nextMatch && nextMatch.index !== undefined) {
    return rest.slice(0, nextMatch.index);
  }
  return rest;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
