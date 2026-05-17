import {test, expect, type Page} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import type {Result} from 'axe-core'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const

const MOCK_CHAT_REPLY =
  '**How Might We** reframes problems as opportunities.\n\n- Start broad\n- Stay human-centered'

/**
 * Automated WCAG 2.1 AA accessibility checks via axe-core.
 *
 * A single violation fails the build — fix the issue, don't disable the rule.
 * If a rule must be excluded, document why in `disableRules` and open a tracking issue.
 */

function formatAxeViolations(violations: Result[]) {
  if (violations.length === 0) return ''
  return violations
    .map(
      (v) =>
        `${v.id} (${v.impact}): ${v.help}\n` +
        v.nodes.map((n) => `  - ${n.target.join(' ')}: ${n.failureSummary}`).join('\n'),
    )
    .join('\n\n')
}

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({page}).withTags([...WCAG_TAGS]).analyze()
  expect(results.violations, formatAxeViolations(results.violations)).toEqual([])
}

async function mockChatApi(page: Page, options?: {delayMs?: number}) {
  await page.route('**/api/chat', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue()
      return
    }
    if (options?.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.delayMs))
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({reply: MOCK_CHAT_REPLY}),
    })
  })
}

test.describe('Accessibility — axe WCAG 2.1 AA', () => {
  test('Landing page (/) has no violations', async ({page}) => {
    await page.goto('/')
    await expect(page.getByRole('heading', {level: 1})).toBeVisible()

    await expectNoA11yViolations(page)
  })

  test('Chat page (/chat) has no violations', async ({page}) => {
    await page.goto('/chat')
    await expect(page.getByRole('heading', {level: 1})).toBeVisible()

    await expectNoA11yViolations(page)
  })

  test('Chat page — conversation and loading states have no violations', async ({page}) => {
    await mockChatApi(page, {delayMs: 800})

    await page.goto('/chat')
    await expect(page.getByRole('heading', {level: 1})).toBeVisible()

    const starter = page.getByRole('button', {
      name: 'What frameworks help with problem framing?',
    })
    await expect(starter).toBeVisible()
    await starter.click()

    await expect(page.getByRole('status')).toBeVisible({timeout: 5000})
    await expectNoA11yViolations(page)

    await expect(page.getByRole('log').getByText('Knowledge base')).toBeVisible({
      timeout: 10_000,
    })
    await expectNoA11yViolations(page)
  })
})
