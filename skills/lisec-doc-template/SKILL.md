---
name: myorg-doc-template
description: "Complete HTML template, compliance rules, and per-section content guide for Org product documentation. Contains standalone HTML skeleton with Org branding, i18n, WCAG 2.2 AA accessibility, sections A–I, search, print CSS, and EU regulation compliance (GPSR/PLD/CRA). Used exclusively by the @product-manual agent. Use when: generating product documentation HTML, doc template, documentation skeleton, compliance checklist."
---

# Org Documentation Template Skill

This skill provides the complete HTML template, compliance rules, and generation checklist for the `@product-manual` agent.

## Pre-Generation Checklist

Before generating, the agent MUST have:

- [ ] Product name and version
- [ ] Product type classification (Management Software / HMI-Visu / PLC-SIL)
- [ ] Target audience(s)
- [ ] i18n key → Multiterm ID map extracted from product repo
- [ ] Multiterm/Quickterm translations from `ng-infra-multiterm` repo (per-language `.txt` or `.json` exports)
- [ ] Logo — use `logo.svg` from this skill folder (`skills/myorg-doc-template/logo.svg`). This is the ONLY approved logo source. NEVER create a text-based SVG, PNG, or placeholder. The agent MUST read this file, convert fills to `white` for the header context, and embed inline.
- [ ] Roboto font files (embed via `@font-face` if found in platform repo; otherwise system sans fallback — do NOT scan if not readily available)
- [ ] Route/screen structure from Router.tsx
- [ ] Domain feature list from src/domain/
- [ ] Error messages/constants (if available)
- [ ] OSS dependency list from package.json (if available)

## Complete HTML Template

The generated HTML MUST follow this exact structure. Replace `{{PRODUCT_NAME}}`, `{{PRODUCT_VERSION}}`, `{{DATE}}`, and all `t("ID")` calls with actual extracted data.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{PRODUCT_NAME}} — User Documentation</title>
<style>
/* ===== Org Corporate Design ===== */
:root {
  --myorg-violet: rgb(136,27,76);       /* primary: header bg, h1/h2 headings, nav active, borders */
  --myorg-gray-70: rgb(119,129,135);    /* secondary text: subtitles, footer, captions */
  --myorg-gray-30: rgb(196,202,206);    /* borders, dividers, table lines */
  --myorg-blue: rgb(53,99,162);         /* accents: step numbers, info boxes, links */
  --myorg-yellowgreen: rgb(187,201,52); /* CTA: buttons, search highlights, focus rings */
  --myorg-darkgray: rgb(60,69,75);      /* body text, h3 headings, primary readable text */
  --myorg-white: #ffffff;
  --myorg-light-bg: #f8f9fa;
  --nav-width: 280px;
  --header-height: 64px;
}

/*
 * Typography — Roboto preferred.
 * If Roboto font files are found in the platform repo, the agent MUST embed
 * them as base64 @font-face rules below. Otherwise the system sans stack is used.
 * Example @font-face (agent replaces {{ROBOTO_WOFF2_BASE64}}):
 *   @font-face { font-family:'Roboto'; font-weight:400; font-style:normal;
 *     src: url(data:font/woff2;base64,{{ROBOTO_WOFF2_BASE64}}) format('woff2'); }
 */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 15px; line-height: 1.6; color: var(--myorg-darkgray);
  background: var(--myorg-white);
}

/* ===== Header ===== */
.doc-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: var(--header-height); background: var(--myorg-violet);
  display: flex; align-items: center; padding: 0 24px; gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.doc-header .logo { height: 36px; flex-shrink: 0; }
.doc-header .logo svg { height: 36px; width: auto; }
.doc-header .product-title {
  color: var(--myorg-white); font-size: 18px; font-weight: 500;
  margin-left: 16px; flex-shrink: 0;
}
.doc-header .spacer { flex: 1; }
.doc-header select, .doc-header input, .doc-header button {
  height: 34px; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px;
  background: rgba(255,255,255,0.15); color: var(--myorg-white);
  padding: 0 10px; font-size: 13px; outline: none;
}
.doc-header select option { color: var(--myorg-darkgray); background: white; }
.doc-header input::placeholder { color: rgba(255,255,255,0.6); }
.doc-header button { cursor: pointer; background: var(--myorg-yellowgreen); color: var(--myorg-darkgray);
  border-color: var(--myorg-yellowgreen); font-weight: 500; padding: 0 16px; }
.doc-header button:hover { opacity: 0.9; }
.doc-header button:focus-visible, .doc-header select:focus-visible, .doc-header input:focus-visible {
  outline: 2px solid var(--myorg-yellowgreen); outline-offset: 2px;
}

/* ===== Navigation ===== */
.doc-nav {
  position: fixed; top: var(--header-height); left: 0; bottom: 0;
  width: var(--nav-width); background: var(--myorg-light-bg);
  border-right: 1px solid var(--myorg-gray-30); overflow-y: auto;
  padding: 16px 0; z-index: 50;
}
.doc-nav a {
  display: block; padding: 8px 20px; color: var(--myorg-darkgray);
  text-decoration: none; font-size: 14px; border-left: 3px solid transparent;
  transition: all 0.15s;
}
.doc-nav a:hover { background: rgba(136,27,76,0.06); color: var(--myorg-violet); }
.doc-nav a.active { border-left-color: var(--myorg-violet); color: var(--myorg-violet); font-weight: 500; }
.doc-nav a.sub { padding-left: 36px; font-size: 13px; }
.doc-nav a:focus-visible { outline: 2px solid var(--myorg-violet); outline-offset: -2px; }

/* ===== Main Content ===== */
.doc-main {
  margin-left: var(--nav-width); margin-top: var(--header-height);
  padding: 32px 48px 80px; max-width: 960px;
}
.doc-main section { margin-bottom: 48px; }
.doc-main h1 { font-size: 28px; color: var(--myorg-violet); margin-bottom: 8px; border-bottom: 2px solid var(--myorg-violet); padding-bottom: 8px; }
.doc-main h2 { font-size: 22px; color: var(--myorg-violet); margin: 32px 0 12px; }
.doc-main h3 { font-size: 17px; color: var(--myorg-darkgray); margin: 20px 0 8px; }
.doc-main p, .doc-main li { margin-bottom: 8px; color: var(--myorg-darkgray); }
.doc-main .caption, .doc-main figcaption { color: var(--myorg-gray-70); font-size: 13px; }
.doc-main ul, .doc-main ol { padding-left: 24px; }
.doc-main table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
.doc-main th { background: var(--myorg-violet); color: white; text-align: left; padding: 10px 12px; }
.doc-main td { padding: 8px 12px; border-bottom: 1px solid var(--myorg-gray-30); }
.doc-main tr:hover td { background: rgba(136,27,76,0.03); }

/* Metadata box */
.meta-box {
  background: var(--myorg-light-bg); border: 1px solid var(--myorg-gray-30);
  border-left: 4px solid var(--myorg-violet); border-radius: 4px;
  padding: 16px 20px; margin-bottom: 32px; font-size: 13px;
}
.meta-box dt { font-weight: 600; display: inline; }
.meta-box dd { display: inline; margin: 0 24px 0 4px; }

/* Workflow steps */
.step { display: flex; gap: 12px; margin: 12px 0; }
.step-num {
  flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
  background: var(--myorg-blue); color: white; font-size: 14px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
}
.step-content { flex: 1; }

/* Warning/Info boxes */
.box-warning, .box-info, .box-placeholder {
  border-radius: 4px; padding: 12px 16px; margin: 16px 0; font-size: 14px;
}
.box-warning { background: #fff3e0; border-left: 4px solid #ff9800; }
.box-info { background: #e3f2fd; border-left: 4px solid var(--myorg-blue); }
.box-placeholder { background: #fff8e1; border: 2px dashed #ffc107; }
.box-placeholder::before { content: "⚠ PLACEHOLDER — "; font-weight: 700; color: #f57f17; }
/* RULE: NEVER use .box-placeholder on inline elements (<dd>, <span>).
   The ::before pseudo-element breaks inline layout.
   Always wrap placeholder content in a block-level <div class="box-placeholder">. */

/* Search highlight */
mark { background: var(--myorg-yellowgreen); padding: 1px 3px; border-radius: 2px; }

/* Footer */
.doc-footer {
  margin-left: var(--nav-width); padding: 24px 48px;
  border-top: 1px solid var(--myorg-gray-30); font-size: 12px;
  color: var(--myorg-gray-70);
}
.doc-main a { color: var(--myorg-blue); text-decoration: none; }
.doc-main a:hover { text-decoration: underline; }
.doc-main a:focus-visible { outline: 2px solid var(--myorg-blue); outline-offset: 2px; }

/* ===== Cover Page (print only) ===== */
.print-cover {
  display: none;
}

/* ===== Print / PDF ===== */
@media print {
  /* --- Page setup --- */
  @page {
    size: A4 portrait;
    margin: 20mm 18mm 25mm 18mm;
  }
  @page :first {
    margin-top: 0;
    margin-bottom: 0;
  }

  /* --- Hide screen-only elements --- */
  .doc-header, .doc-nav, .no-print, #searchInput, #langSwitcher { display: none !important; }

  /* --- Show cover page --- */
  .print-cover {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    page-break-after: always;
    break-after: page;
    text-align: center;
    padding: 40mm 20mm;
  }
  .print-cover .cover-logo svg { height: 48px; width: auto; }
  .print-cover .cover-logo svg path { fill: var(--myorg-violet) !important; }
  .print-cover .cover-title {
    font-size: 32px; font-weight: 700; color: var(--myorg-violet);
    margin: 24px 0 8px; line-height: 1.2;
  }
  .print-cover .cover-subtitle {
    font-size: 16px; color: var(--myorg-gray-70); margin-bottom: 32px;
  }
  .print-cover .cover-meta {
    font-size: 12px; color: var(--myorg-gray-70); line-height: 1.8;
  }
  .print-cover .cover-line {
    width: 60%; height: 3px; background: var(--myorg-violet);
    margin: 24px auto;
  }

  /* --- Main content --- */
  .doc-main {
    margin: 0 !important; padding: 0 !important; max-width: 100%;
  }
  .doc-footer { margin: 0; padding: 16px 0; border-top: 1px solid var(--myorg-gray-30); }

  /* --- Typography --- */
  body { font-size: 11pt; line-height: 1.5; color: #000; }
  .doc-main h1 {
    font-size: 20pt; color: var(--myorg-violet);
    break-after: avoid; margin-top: 24pt;
    border-bottom: 2px solid var(--myorg-violet); padding-bottom: 4pt;
  }
  .doc-main h2 { font-size: 15pt; color: var(--myorg-violet); break-after: avoid; margin-top: 18pt; }
  .doc-main h3 { font-size: 12pt; break-after: avoid; margin-top: 12pt; }
  .doc-main p, .doc-main li { orphans: 3; widows: 3; }

  /* --- Page breaks --- */
  section { break-inside: avoid; }
  .doc-main section:not(:first-of-type) > h1 {
    break-before: page;
  }
  table, figure, img, .step { break-inside: avoid; }
  tr { break-inside: avoid; }

  /* --- Tables --- */
  .doc-main table { font-size: 9pt; width: 100%; }
  .doc-main th {
    background: var(--myorg-violet) !important; color: white !important;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .doc-main td { padding: 6px 8px; }
  .doc-main tr:nth-child(even) td {
    background: #f5f5f5 !important;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* --- Preserve colored boxes --- */
  .box-warning, .box-info, .box-placeholder, .meta-box {
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    break-inside: avoid;
  }
  .meta-box { background: #f5f5f5 !important; }

  /* --- Step numbers --- */
  .step-num {
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    background: var(--myorg-blue) !important; color: white !important;
  }

  /* --- Images --- */
  img, figure {
    max-width: 100% !important; height: auto !important;
    break-inside: avoid;
  }
  figure { margin: 12pt 0; }
  figcaption { font-size: 9pt; color: var(--myorg-gray-70); text-align: center; margin-top: 4pt; }

  /* --- Links: show URL in print --- */
  .doc-main a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 8pt; color: var(--myorg-gray-70); word-break: break-all;
  }
  .doc-nav a::after { content: none !important; }

  /* --- Search highlight removal --- */
  mark.search-hl { background: none !important; padding: 0; }
}
</style>
</head>
<body>

<!-- ===== PRINT COVER PAGE (visible only when printing/PDF) ===== -->
<div class="print-cover">
  <div class="cover-logo" aria-hidden="true">
    <!-- AGENT: Copy the SAME SVG from logo.svg here, keeping original fill="#881B4C" (violet on white bg) -->
    <svg width="165" height="48" viewBox="0 0 55 16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Org logo"><g mask="url(#mask0_2738_550)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.1562 11.0393H5.7846L8.66821 0.458631C8.6716 0.431541 8.67456 0.389631 8.67456 0.370581C8.67456 0.211841 8.55773 0.085691 8.4066 0.059021H4.94855C4.7297 0.065791 4.55699 0.221151 4.50746 0.426881L0.596473 14.7658L0.598593 14.7666C0.594363 14.7844 0.588013 14.8009 0.588013 14.82C0.588013 14.9461 0.686643 15.0473 0.811103 15.0574H9.3307C9.41367 15.0363 9.48098 14.9817 9.52119 14.908L10.4673 11.4669L10.4656 11.4661C10.4703 11.4445 10.4741 11.3839 10.4741 11.3611C10.4741 11.185 10.3319 11.0419 10.1562 11.0394" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.1039 3.6576L14.1043 3.65802H17.6839C17.7969 3.64151 17.8858 3.56531 17.9247 3.46118L18.7578 0.421371C18.7587 0.403591 18.7599 0.385811 18.7599 0.376081C18.7599 0.207181 18.6287 0.072991 18.4636 0.059021H15.0394C14.843 0.059021 14.6864 0.182201 14.614 0.351951L13.8072 3.28509C13.8063 3.3143 13.8051 3.33927 13.8051 3.34562C13.8051 3.5141 13.938 3.64914 14.1039 3.6576" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.4475 5.19669C17.4517 5.1751 17.4559 5.11499 17.4559 5.09213C17.4559 4.91392 17.3116 4.76957 17.1334 4.76957H17.1325V4.76703H13.6973C13.5073 4.79116 13.3595 4.92535 13.307 5.1061L10.644 14.7894C10.6414 14.7995 10.6381 14.8093 10.6381 14.8199C10.6381 14.9464 10.7367 15.0476 10.8611 15.0578L13.7096 15.0586L13.71 15.0578H14.58C14.693 15.0413 14.7814 14.9651 14.8208 14.8609L15.6539 11.8207C15.6543 11.8156 15.6543 11.8118 15.6543 11.8067L17.4496 5.19753L17.4475 5.19669Z" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M28.5646 7.55377C28.3428 7.02167 27.9876 6.6229 27.613 6.34479C27.0407 5.9219 26.44 5.74411 25.9655 5.64759C25.4939 5.55446 25.1518 5.55023 25.0469 5.54896L23.6021 5.54981C22.6111 5.54981 22.8647 4.07753 23.8722 4.07753L23.9073 4.07795H25.8812H29.9078C30.0153 4.04874 30.0987 3.96493 30.1275 3.85571H30.1296L31.063 0.441271C31.0651 0.415871 31.0676 0.389631 31.0676 0.374811C31.0676 0.208871 30.9398 0.076801 30.7785 0.059021H27.787H26.0188H25.1095C24.1989 0.099661 23.4171 0.270681 22.565 0.623721C21.8737 0.916231 21.0516 1.40262 20.3269 2.154C19.6009 2.89945 19.0409 3.87519 18.7674 4.89749C18.4842 5.9109 18.5177 6.85743 18.8195 7.56309C19.0409 8.0952 19.3956 8.49438 19.7702 8.7725C20.343 9.19497 20.9437 9.37276 21.4186 9.47012C21.8877 9.56282 22.2297 9.56706 22.3364 9.5679L23.7536 9.56875L23.7989 9.57256C24.2108 9.60473 24.4622 9.9637 24.3518 10.368C24.2641 10.6884 23.9788 10.9335 23.669 11.0135C23.6114 11.0275 23.5437 11.0398 23.4658 11.0393H20.5944V11.0381H17.4679C17.3599 11.0677 17.2761 11.1519 17.2477 11.2607H17.246L16.3122 14.6756C16.3101 14.701 16.308 14.7273 16.308 14.7421C16.308 14.9076 16.4354 15.0397 16.5967 15.0579H19.5019H20.4569H22.2678C23.1796 15.0113 23.964 14.847 24.8191 14.4932C25.5104 14.2006 26.3329 13.7143 27.0568 12.9625C27.7823 12.2174 28.3432 11.2417 28.6158 10.2207C28.8999 9.20597 28.866 8.25944 28.5646 7.55378" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M40.342 5.84063H35.1911L35.6712 4.07795H41.3033C41.4113 4.04874 41.4951 3.9645 41.5235 3.85529L41.5252 3.85571L42.459 0.441271C42.4611 0.415871 42.4632 0.389201 42.4632 0.374391C42.4632 0.208451 42.3358 0.076801 42.1745 0.059021H36.3645H33.9398H32.9404C32.7435 0.059021 32.5873 0.182631 32.5149 0.351951L28.5828 14.803C28.5819 14.8085 28.579 14.8132 28.579 14.8195C28.579 14.947 28.6785 15.0477 28.8029 15.0579H38.3122C38.4202 15.0287 38.5036 14.944 38.5323 14.8356H38.534L39.4679 11.4212C39.4696 11.3958 39.4721 11.3695 39.4721 11.3547C39.4721 11.1884 39.3443 11.0567 39.1834 11.0389H33.7752L34.2552 9.27624H39.6643C39.7528 9.25253 39.8226 9.19073 39.8616 9.10818L40.6443 6.23473C40.6472 6.20806 40.6493 6.17631 40.6493 6.1598C40.6493 5.98751 40.513 5.84909 40.342 5.84062" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M54.1132 0.059021H49.2312C48.23 0.103891 47.3716 0.291841 46.4365 0.680021C45.6779 1.00131 44.7771 1.53681 43.9855 2.36269C43.2227 3.15005 42.6296 4.17193 42.3235 5.24715C42.3113 5.29117 41.0722 9.8782 41.0608 9.92222C40.7556 11.0368 40.7979 12.0777 41.134 12.8537C41.3813 13.4387 41.7741 13.8777 42.1877 14.1833C42.8197 14.6477 43.4822 14.8437 44.0041 14.9503C44.2852 15.0058 44.5222 15.0316 44.7013 15.0447L44.7017 15.0524H44.827C44.9121 15.0562 44.9773 15.0574 45.0145 15.0579L45.0154 15.0524H50.8296C50.9371 15.0227 51.0209 14.9389 51.0493 14.8297L51.0514 14.8301L51.9848 11.4153C51.9869 11.3903 51.9891 11.3636 51.9891 11.3488C51.9891 11.1829 51.8621 11.0508 51.7004 11.0334H45.7075C45.1449 11.0334 44.9443 10.6016 45.0353 10.1843C45.0408 10.1593 46.1609 6.07685 46.1685 6.05188C46.7218 4.19777 48.4675 4.08474 49.0932 4.07797H53.2421C53.35 4.04876 53.4334 3.96452 53.4622 3.85531L53.4639 3.85573L54.3977 0.440861C54.3998 0.415881 54.4019 0.389221 54.4019 0.374401C54.4019 0.208461 54.2745 0.076811 54.1132 0.059031" fill="#881B4C"/>
</g></svg>
  </div>
  <div class="cover-line"></div>
  <div class="cover-title">{{PRODUCT_NAME}}</div>
  <div class="cover-subtitle">User Documentation</div>
  <div class="cover-line"></div>
  <div class="cover-meta">
    <div>Version: {{PRODUCT_VERSION}}</div>
    <div>Date: {{DATE}}</div>
    <div>&copy; Org Austria GmbH</div>
  </div>
</div>

<!-- ===== HEADER ===== -->
<!-- ⛔ LOGO RULE: The official Org logo SVG lives at skills/myorg-doc-template/logo.svg.
     The agent MUST read that file and embed it inline below.
     For header use: change all fill="#881B4C" to fill="white" (white-on-violet header).
     For other contexts (light backgrounds): use the original fill="#881B4C".
     NEVER replace it with a text-based SVG like <text>Org</text>.
     NEVER simplify it. NEVER use a <rect>+<text> placeholder. NEVER use a PNG.
     This is the official Org vector logo and must be reproduced character-for-character. -->
<header class="doc-header">
  <div class="logo" aria-label="Org">
    <svg width="55" height="16" viewBox="0 0 55 16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Org logo"><g mask="url(#mask0_2738_550)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.1562 11.0393H5.7846L8.66821 0.458631C8.6716 0.431541 8.67456 0.389631 8.67456 0.370581C8.67456 0.211841 8.55773 0.085691 8.4066 0.059021H4.94855C4.7297 0.065791 4.55699 0.221151 4.50746 0.426881L0.596473 14.7658L0.598593 14.7666C0.594363 14.7844 0.588013 14.8009 0.588013 14.82C0.588013 14.9461 0.686643 15.0473 0.811103 15.0574H9.3307C9.41367 15.0363 9.48098 14.9817 9.52119 14.908L10.4673 11.4669L10.4656 11.4661C10.4703 11.4445 10.4741 11.3839 10.4741 11.3611C10.4741 11.185 10.3319 11.0419 10.1562 11.0394" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.1039 3.6576L14.1043 3.65802H17.6839C17.7969 3.64151 17.8858 3.56531 17.9247 3.46118L18.7578 0.421371C18.7587 0.403591 18.7599 0.385811 18.7599 0.376081C18.7599 0.207181 18.6287 0.072991 18.4636 0.059021H15.0394C14.843 0.059021 14.6864 0.182201 14.614 0.351951L13.8072 3.28509C13.8063 3.3143 13.8051 3.33927 13.8051 3.34562C13.8051 3.5141 13.938 3.64914 14.1039 3.6576" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.4475 5.19669C17.4517 5.1751 17.4559 5.11499 17.4559 5.09213C17.4559 4.91392 17.3116 4.76957 17.1334 4.76957H17.1325V4.76703H13.6973C13.5073 4.79116 13.3595 4.92535 13.307 5.1061L10.644 14.7894C10.6414 14.7995 10.6381 14.8093 10.6381 14.8199C10.6381 14.9464 10.7367 15.0476 10.8611 15.0578L13.7096 15.0586L13.71 15.0578H14.58C14.693 15.0413 14.7814 14.9651 14.8208 14.8609L15.6539 11.8207C15.6543 11.8156 15.6543 11.8118 15.6543 11.8067L17.4496 5.19753L17.4475 5.19669Z" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M28.5646 7.55377C28.3428 7.02167 27.9876 6.6229 27.613 6.34479C27.0407 5.9219 26.44 5.74411 25.9655 5.64759C25.4939 5.55446 25.1518 5.55023 25.0469 5.54896L23.6021 5.54981C22.6111 5.54981 22.8647 4.07753 23.8722 4.07753L23.9073 4.07795H25.8812H29.9078C30.0153 4.04874 30.0987 3.96493 30.1275 3.85571H30.1296L31.063 0.441271C31.0651 0.415871 31.0676 0.389631 31.0676 0.374811C31.0676 0.208871 30.9398 0.076801 30.7785 0.059021H27.787H26.0188H25.1095C24.1989 0.099661 23.4171 0.270681 22.565 0.623721C21.8737 0.916231 21.0516 1.40262 20.3269 2.154C19.6009 2.89945 19.0409 3.87519 18.7674 4.89749C18.4842 5.9109 18.5177 6.85743 18.8195 7.56309C19.0409 8.0952 19.3956 8.49438 19.7702 8.7725C20.343 9.19497 20.9437 9.37276 21.4186 9.47012C21.8877 9.56282 22.2297 9.56706 22.3364 9.5679L23.7536 9.56875L23.7989 9.57256C24.2108 9.60473 24.4622 9.9637 24.3518 10.368C24.2641 10.6884 23.9788 10.9335 23.669 11.0135C23.6114 11.0275 23.5437 11.0398 23.4658 11.0393H20.5944V11.0381H17.4679C17.3599 11.0677 17.2761 11.1519 17.2477 11.2607H17.246L16.3122 14.6756C16.3101 14.701 16.308 14.7273 16.308 14.7421C16.308 14.9076 16.4354 15.0397 16.5967 15.0579H19.5019H20.4569H22.2678C23.1796 15.0113 23.964 14.847 24.8191 14.4932C25.5104 14.2006 26.3329 13.7143 27.0568 12.9625C27.7823 12.2174 28.3432 11.2417 28.6158 10.2207C28.8999 9.20597 28.866 8.25944 28.5646 7.55378" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M40.342 5.84063H35.1911L35.6712 4.07795H41.3033C41.4113 4.04874 41.4951 3.9645 41.5235 3.85529L41.5252 3.85571L42.459 0.441271C42.4611 0.415871 42.4632 0.389201 42.4632 0.374391C42.4632 0.208451 42.3358 0.076801 42.1745 0.059021H36.3645H33.9398H32.9404C32.7435 0.059021 32.5873 0.182631 32.5149 0.351951L28.5828 14.803C28.5819 14.8085 28.579 14.8132 28.579 14.8195C28.579 14.947 28.6785 15.0477 28.8029 15.0579H38.3122C38.4202 15.0287 38.5036 14.944 38.5323 14.8356H38.534L39.4679 11.4212C39.4696 11.3958 39.4721 11.3695 39.4721 11.3547C39.4721 11.1884 39.3443 11.0567 39.1834 11.0389H33.7752L34.2552 9.27624H39.6643C39.7528 9.25253 39.8226 9.19073 39.8616 9.10818L40.6443 6.23473C40.6472 6.20806 40.6493 6.17631 40.6493 6.1598C40.6493 5.98751 40.513 5.84909 40.342 5.84062" fill="#881B4C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M54.1132 0.059021H49.2312C48.23 0.103891 47.3716 0.291841 46.4365 0.680021C45.6779 1.00131 44.7771 1.53681 43.9855 2.36269C43.2227 3.15005 42.6296 4.17193 42.3235 5.24715C42.3113 5.29117 41.0722 9.8782 41.0608 9.92222C40.7556 11.0368 40.7979 12.0777 41.134 12.8537C41.3813 13.4387 41.7741 13.8777 42.1877 14.1833C42.8197 14.6477 43.4822 14.8437 44.0041 14.9503C44.2852 15.0058 44.5222 15.0316 44.7013 15.0447L44.7017 15.0524H44.827C44.9121 15.0562 44.9773 15.0574 45.0145 15.0579L45.0154 15.0524H50.8296C50.9371 15.0227 51.0209 14.9389 51.0493 14.8297L51.0514 14.8301L51.9848 11.4153C51.9869 11.3903 51.9891 11.3636 51.9891 11.3488C51.9891 11.1829 51.8621 11.0508 51.7004 11.0334H45.7075C45.1449 11.0334 44.9443 10.6016 45.0353 10.1843C45.0408 10.1593 46.1609 6.07685 46.1685 6.05188C46.7218 4.19777 48.4675 4.08474 49.0932 4.07797H53.2421C53.35 4.04876 53.4334 3.96452 53.4622 3.85531L53.4639 3.85573L54.3977 0.440861C54.3998 0.415881 54.4019 0.389221 54.4019 0.374401C54.4019 0.208461 54.2745 0.076811 54.1132 0.059031" fill="#881B4C"/>
</g></svg>
  </div>
  <span class="product-title">{{PRODUCT_NAME}}</span>
  <div class="spacer"></div>
  <form role="search" style="display:contents">
    <input type="search" id="searchInput" placeholder="Search documentation" aria-label="Search documentation" autocomplete="off" />
  </form>
  <select id="langSwitcher" aria-label="Select language">  
    <option value="en" selected>English</option>
    <option value="de">Deutsch</option>
    <option value="fr">Français</option>
    <option value="it">Italiano</option>
    <option value="es">Español</option>
    <option value="cs">Čeština</option>
    <option value="pl">Polski</option>
  </select>
  <button type="button" onclick="window.print()" aria-label="Print or save as PDF">Print / PDF</button>
</header>

<!-- ===== NAVIGATION ===== -->
<!-- RULE: Nav MUST include BOTH top-level sections AND sub-items (class="sub") for every h2/subsection.
     This creates the hierarchical left-nav seen in the reference design. NEVER omit sub-items. -->
<nav class="doc-nav" aria-label="Documentation sections">
  <a href="#sec-a">A. Purpose &amp; Intended Use</a>
  <a href="#sec-b">B. Safe Use</a>
  <a href="#sec-c">C. System Overview</a>
  <!-- AGENT: Add class="sub" links for each C.x subsection discovered from Router.tsx / domain/ -->
  <a href="#sec-c1" class="sub">C.1 Modules</a>
  <a href="#sec-c2" class="sub">C.2 [Sub-section name]</a>
  <a href="#sec-c3" class="sub">C.3 System Requirements</a>
  <a href="#sec-d">D. First Steps</a>
  <a href="#sec-e">E. Workflows</a>
  <!-- AGENT: Add class="sub" links for EVERY workflow (E.1, E.2, E.3, ...) -->
  <a href="#sec-e1" class="sub">E.1 [Workflow name]</a>
  <a href="#sec-e2" class="sub">E.2 [Workflow name]</a>
  <a href="#sec-e3" class="sub">E.3 [Workflow name]</a>
  <a href="#sec-f">F. Troubleshooting</a>
  <a href="#sec-g">G. Error Messages</a>
  <a href="#sec-h">H. Security &amp; Updates (CRA)</a>
  <a href="#sec-i">I. Legal / OSS</a>
  <a href="#sec-j">J. UI Icons &amp; Symbols</a>
</nav>

<!-- ===== MAIN CONTENT ===== -->
<main class="doc-main">

  <!-- Document Metadata -->
  <dl class="meta-box">
    <dt>Document Version:</dt><dd>1.0</dd>
    <dt>Product Version:</dt><dd>{{PRODUCT_VERSION}}</dd>
    <dt>Last Updated:</dt><dd>{{DATE}}</dd>
    <dt>Languages:</dt><dd>de, en, fr, it, es, cs, pl</dd>
    <dt>Support Period:</dt><dd><div class="box-placeholder">TBD — insert support end date</div></dd>
  </dl>

  <!-- SECTION A — min: product name, 1-sentence purpose, 2+ intended users, 3+ out-of-scope items -->
  <section id="sec-a" aria-labelledby="sec-a-title">
    <h1 id="sec-a-title" data-i18n="doc.section.a.title">A. Purpose &amp; Intended Use</h1>
    <!-- AGENT: What the software does, who uses it, explicit NOT-FOR list.
         Management Software: state it does not control machinery.
         HMI/Visu: reference connected PLC documentation. -->
  </section>

  <!-- SECTION B — min: 1 safety note, 3+ misuse examples, 1 limitation per audience -->
  <section id="sec-b" aria-labelledby="sec-b-title">
    <h1 id="sec-b-title" data-i18n="doc.section.b.title">B. Safe Use &amp; Foreseeable Misuse</h1>
    <!-- AGENT: Safety notes, misuse cases, limitations.
         If NOT PLC/SIL: add box-info stating software is not safety-relevant.
         If PLC/SIL: add SIL level, emergency stop procedure, reference safety manual. -->
  </section>

  <!-- SECTION C — min: architecture diagram or description, roles table, screen list from Router.tsx -->
  <section id="sec-c" aria-labelledby="sec-c-title">
    <h1 id="sec-c-title" data-i18n="doc.section.c.title">C. System Overview</h1>
    <!-- AGENT: Extract screens from Router.tsx, feature areas from domain/ directory.
         Produce a roles table: Role | Access level | Key permissions -->
  </section>

  <!-- SECTION D — min: login steps, first-run configuration, required permissions -->
  <section id="sec-d" aria-labelledby="sec-d-title">
    <h1 id="sec-d-title" data-i18n="doc.section.d.title">D. First Steps</h1>
    <!-- AGENT: Login workflow, initial configuration, prerequisite roles/permissions -->
  </section>

  <!-- SECTION E — min: 3 workflows minimum, each with prerequisites + numbered steps + expected result -->
  <section id="sec-e" aria-labelledby="sec-e-title">
    <h1 id="sec-e-title" data-i18n="doc.section.e.title">E. Normal Operation Workflows</h1>
    <!-- AGENT: 3–7 workflows using .step / .step-num pattern.
         Each workflow: Prerequisites → Steps → Expected Result → Common Pitfalls -->
  </section>

  <!-- SECTION F — min: 5 symptom rows, each with cause + corrective action -->
  <section id="sec-f" aria-labelledby="sec-f-title">
    <h1 id="sec-f-title" data-i18n="doc.section.f.title">F. Troubleshooting</h1>
    <!-- AGENT: Symptom → Cause → Action table. Derive from support patterns if available. -->
    <table>
      <thead><tr><th scope="col">Symptom</th><th scope="col">Likely Cause</th><th scope="col">Corrective Action</th></tr></thead>
      <tbody><!-- AGENT: fill rows --></tbody>
    </table>
  </section>

  <!-- SECTION G — min: all error keys extracted from i18n.tsx -->
  <section id="sec-g" aria-labelledby="sec-g-title">
    <h1 id="sec-g-title" data-i18n="doc.section.g.title">G. Error Messages</h1>
    <table>
      <thead><tr><th scope="col">UI Key / Code</th><th scope="col">Multiterm ID</th><th scope="col">Message</th><th scope="col">User Action</th></tr></thead>
      <tbody>
        <!-- AGENT: Extract from i18n.tsx error-related keys.
             Pattern: <tr><td>key</td><td>99XXXXXX</td><td><span data-t="99XXXXXX"></span></td><td>action</td></tr> -->
      </tbody>
    </table>
  </section>

  <!-- SECTION H — min: secure config checklist, update steps, backup/restore, security contact -->
  <section id="sec-h" aria-labelledby="sec-h-title">
    <h1 id="sec-h-title" data-i18n="doc.section.h.title">H. Security &amp; Updates (CRA)</h1>
    <div class="box-info">CRA (EU) 2024/2847 — full obligations apply from <strong>2027-12-11</strong>.</div>
    <!-- AGENT: Secure configuration guidance, update/patch procedure, data backup,
         security vulnerability reporting contact (MUST include email or URL). -->
  </section>

  <!-- SECTION I — min: copyright notice, list of top-10 OSS dependencies with SPDX license -->
  <section id="sec-i" aria-labelledby="sec-i-title">
    <h1 id="sec-i-title" data-i18n="doc.section.i.title">I. Legal / OSS Notices</h1>
    <!-- AGENT: Extract from package.json or `npx license-checker --json --production`.
         Minimum: copyright line + table of OSS packages (name, version, SPDX license). -->
  </section>

  <!-- SECTION J (optional) — skip if no icon-heavy UI detected -->
  <section id="sec-j" aria-labelledby="sec-j-title">
    <h1 id="sec-j-title">J. UI Icons &amp; Symbols Glossary</h1>
    <!-- AGENT: Extract icon list from platform component library if available. -->
  </section>

  <!-- DEV: Translation Coverage (hidden by default) -->
  <section id="sec-dev" style="display:none">
    <h1>Dev: Translation Coverage</h1>
    <div id="translationCoverage"></div>
  </section>

</main>

<footer class="doc-footer">
  <p>© Org Austria GmbH. All rights reserved. Generated: {{DATE}}</p>
</footer>

<!-- ===== JavaScript ===== -->
<script>
/* === i18n Module === */
const TRANSLATIONS = {
  "en": {
    /* AGENT: Populate from extracted Multiterm data */
  },
  "de": {},
  "fr": {},
  "it": {},
  "es": {},
  "cs": {},
  "pl": {}
};
const DEFAULT_LANG = "en";
let currentLang = DEFAULT_LANG;

function t(id) {
  return TRANSLATIONS[currentLang]?.[id]
    ?? TRANSLATIONS[DEFAULT_LANG]?.[id]
    ?? "[MISSING " + id + "]";
}

function applyTranslations() {
  document.querySelectorAll("[data-t]").forEach(function(el) {
    el.textContent = t(el.getAttribute("data-t"));
  });
  document.querySelectorAll("[data-i18n]").forEach(function(el) {
    var key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[currentLang]?.[key]) el.textContent = t(key);
  });
  updateCoverage();
}

function updateCoverage() {
  var allKeys = Object.keys(TRANSLATIONS[DEFAULT_LANG] || {});
  var missing = allKeys.filter(function(k) { return !TRANSLATIONS[currentLang]?.[k]; });
  var el = document.getElementById("translationCoverage");
  if (!el) return;
  el.innerHTML = "<p>Language: " + currentLang + " — Missing: " + missing.length + "/" + allKeys.length + "</p>"
    + "<ul>" + missing.slice(0, 50).map(function(k) { return "<li>" + k + "</li>"; }).join("") + "</ul>";
}

/* === Language Switcher === */
document.getElementById("langSwitcher").addEventListener("change", function(e) {
  currentLang = e.target.value;
  document.documentElement.lang = currentLang;
  applyTranslations();
});

/* === Client-Side Search === */
document.getElementById("searchInput").addEventListener("input", function(e) {
  var query = e.target.value.trim().toLowerCase();
  var sections = document.querySelectorAll(".doc-main section");
  // Remove old highlights by normalising text nodes
  document.querySelectorAll("mark.search-hl").forEach(function(m) {
    var parent = m.parentNode;
    if (parent) { parent.replaceChild(document.createTextNode(m.textContent), m); parent.normalize(); }
  });
  if (!query) { sections.forEach(function(s) { s.style.display = ""; }); return; }
  sections.forEach(function(sec) {
    var text = sec.textContent.toLowerCase();
    if (!text.includes(query)) { sec.style.display = "none"; return; }
    sec.style.display = "";
    // Highlight matching text nodes (skip script/style)
    var walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n) {
        var tag = n.parentNode && n.parentNode.nodeName;
        return (tag === "SCRIPT" || tag === "STYLE") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = []; var node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function(tn) {
      var idx = tn.nodeValue.toLowerCase().indexOf(query);
      if (idx === -1) return;
      var mark = document.createElement("mark");
      mark.className = "search-hl";
      mark.textContent = tn.nodeValue.slice(idx, idx + query.length);
      var after = tn.splitText(idx);
      after.nodeValue = after.nodeValue.slice(query.length);
      tn.parentNode.insertBefore(mark, after);
    });
  });
});

/* === Active Nav Highlight === */
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      document.querySelectorAll(".doc-nav a").forEach(function(a) { a.classList.remove("active"); });
      var link = document.querySelector('.doc-nav a[href="#' + entry.target.id + '"]');
      if (link) link.classList.add("active");
    }
  });
}, { rootMargin: "-80px 0px -60% 0px" });
document.querySelectorAll(".doc-main section[id]").forEach(function(sec) { observer.observe(sec); });

/* Init */
applyTranslations();
</script>
</body>
</html>
```

## Per-Section Content Minimums

### ⛔ CRITICAL LAYOUT RULES (Non-Negotiable)

The generated HTML MUST use this exact layout architecture — no alternatives:

| Element | Required Implementation | FORBIDDEN Alternatives |
|---------|------------------------|------------------------|
| **Header** | `position: fixed; top: 0;` with `--myorg-violet` bg | `position: sticky`, flex wrapper, navy/blue |
| **Header contents** | `.logo` div + `.product-title` span + `.spacer` div + search input + lang select + Print button (`background: var(--myorg-yellowgreen)`) | Title-only header, no search, no lang switcher, transparent print button |
| **Navigation** | `position: fixed; top: var(--header-height); left: 0;` as `.doc-nav` | `position: sticky`, flex sidebar, `.side-nav`, `<ol><li>` wrapper |
| **Nav items** | Flat `<a>` links + `<a class="sub">` for sub-sections. NO `<ol>`, `<li>`, `<h2>Contents</h2>` | Ordered list, nested lists, numbered items |
| **Nav sub-items** | EVERY `<h2>` subsection MUST have a corresponding `<a class="sub">` in nav | Top-level-only nav |
| **Main content** | `margin-left: var(--nav-width); margin-top: var(--header-height); max-width: 960px;` as `.doc-main` | Flex layout `.layout`, `.content` class, max-width without margin-left, `max-width: 1100px` |
| **Section headings** | `<h1>` for section titles (A, B, C...), `<h2>` for subsections, `<h3>` for sub-sub | `<h2>` for section titles inside `.section` class |
| **Section wrappers** | Every section in `<section id="sec-x" aria-labelledby="sec-x-title">` | Bare `<h1>` without `<section>` wrapper |
| **Wrapper** | NO wrapper div between header and nav/main | `<div class="layout">` flex container |
| **Print cover** | `<div class="print-cover">` with logo (violet fill) + title + subtitle + meta | Omitting print cover entirely |
| **Metadata** | `<dl class="meta-box">` with `border-left: 4px solid var(--myorg-violet)` | `<dl class="doc-meta">`, grid layout, or any other class name |
| **Box classes** | `.box-warning`, `.box-info`, `.box-placeholder` | `.box-warn`, `.box-danger`, or other invented class names |

### ⛔ EXACT CSS VALUES (Non-Negotiable)

These values MUST be copied verbatim. Do NOT invent your own:

| Property | Required Value | WRONG Value |
|----------|---------------|-------------|
| `--nav-width` | `280px` | `270px`, `260px`, `300px` |
| `--header-height` | `64px` | `56px`, `48px` |
| Body font-size | `15px` | `14px`, `16px` |
| Body font-family | `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` | `"Segoe UI", system-ui, Arial, sans-serif` |
| Body color | `var(--myorg-darkgray)` | `#222`, `#333` |
| h1 font-size | `28px` | `22px`, `24px` |
| h1 color | `var(--myorg-violet)` | `var(--myorg-darkgray)` |
| h1 border-bottom | `2px solid var(--myorg-violet)` | `2px solid var(--myorg-gray-30)` |
| h2 font-size | `22px` | `17px`, `18px` |
| h2 color | `var(--myorg-violet)` | `var(--myorg-darkgray)` |
| h3 color | `var(--myorg-darkgray)` | `var(--myorg-violet)` |
| `.step-num` background | `var(--myorg-blue)` | `var(--myorg-violet)` |
| Print button bg | `var(--myorg-yellowgreen)` | `rgba(255,255,255,.15)`, transparent |
| Print button color | `var(--myorg-darkgray)` | `#fff`, white |

### ⛔ LOGO RULES (Non-Negotiable)

1. **ALWAYS read `skills/myorg-doc-template/logo.svg`** before generating. Use `read_file` tool.
2. The real logo has **6 complex paths** with `fill-rule="evenodd" clip-rule="evenodd"` and a `<mask>` element.
3. Path coordinates start with: `M10.1562`, `M14.1039`, `M17.4475`, `M28.5646`, `M40.342`, `M54.1132`.
4. **Header logo**: change all `fill="#881B4C"` → `fill="white"` (white on violet background).
5. **Print cover logo**: keep original `fill="#881B4C"` (violet on white background). Use a SEPARATE mask ID (e.g. `mask0_print`) so it does not conflict with the header logo's mask. The print cover `<div class="print-cover">` MUST contain the full logo SVG — NEVER leave it empty.
6. NEVER use simplified rectangles (`M0 0h4v12H0z`) — that is NOT the Org logo.
7. NEVER use `<text>Org</text>` or any text-based substitute.
8. If your embedded SVG doesn't contain the exact path starts listed in #3, **STOP and re-read the file**.

**SELF-CHECK before saving — verify ALL 10 items:**
1. Header is violet (`--myorg-violet`), `position: fixed`, `height: 64px`, spans full width
2. Header contains: `.logo` div (real SVG with white fills) + `.product-title` + `.spacer` + search input + lang select + print button (yellowgreen bg)
3. Left nav is `position: fixed`, `width: 280px`, shows sections + indented `.sub` items for EVERY `<h2>`
4. Main content uses `margin-left: 280px; margin-top: 64px; max-width: 960px;`
5. `<h1>` headings: `28px`, `color: var(--myorg-violet)`, `border-bottom: 2px solid var(--myorg-violet)`
6. `<h2>` headings: `22px`, `color: var(--myorg-violet)` — NOT darkgray
7. Tables have violet header rows (`background: var(--myorg-violet); color: white;`)
8. Every section wrapped in `<section id="sec-x">` — NOT bare `<h1>` at top level
9. Metadata uses `<dl class="meta-box">` — NOT `doc-meta`
10. Print cover `<div class="print-cover">` is present with violet-fill logo

If ANY item fails, you have deviated from the template. Re-read this skill and fix.

The agent MUST meet these minimums before saving. Sections falling short must use `.box-placeholder`.

| Section | Minimum Required Content |
|---------|--------------------------|
| A · Purpose | Product name, 1-sentence purpose, audience table (role + description), ≥ 3 explicit out-of-scope items |
| B · Safe Use | ≥ 1 safety callout box, ≥ 3 foreseeable misuse examples, product-type classification statement |
| C · System Overview | Role/permission table, screen inventory (from Router.tsx), domain feature list |
| D · First Steps | Login workflow (≥ 4 steps), prerequisites, first-run configuration |
| E · Workflows | ≥ 3 named workflows, each: Prerequisites + numbered steps + Expected Result + Common Pitfalls |
| F · Troubleshooting | ≥ 5 symptom rows in Symptom/Cause/Action table |
| G · Error Messages | All error-related keys extracted from i18n.tsx; minimum 5 rows; no invented IDs |
| H · CRA Security | Secure config checklist, update procedure, backup/restore steps, security contact (email or URL) |
| I · Legal/OSS | Copyright notice, ≥ 10 OSS packages with name + version + SPDX licence identifier |

---

## Compliance Checklist (agent must verify before saving)

### GPSR (EU) 2023/988
- [ ] Clear instructions for safe use included (Section B)
- [ ] Product identification present (metadata box)
- [ ] Manufacturer/economic operator info present (Section I footer)
- [ ] Intended use clearly stated (Section A)

### PLD (EU) 2024/2853
- [ ] Intended use documented (Section A)
- [ ] Limitations and boundaries documented (Section A, B)
- [ ] Foreseeable misuse addressed (Section B)
- [ ] Operating instructions provided (Section E)

### CRA (EU) 2024/2847 (mandatory content by 2027-12-11)
- [ ] Secure configuration guidance (Section H)
- [ ] Update/patch procedures (Section H)
- [ ] Security vulnerability reporting channel (Section H)
- [ ] Data backup/restore procedures (Section H)
- [ ] Default credential warnings (Section H)

## Content Generation Rules

### Multiterm/Quickterm Translation Extraction

The primary source for ALL user-visible strings is the `ng-infra-multiterm` repository:

```bash
# Per-language export files use naming convention:
# ger.txt (de), eng.txt (en), fra.txt (fr), ita.txt (it), spa.txt (es), ces.txt (cs), pol.txt (pl)
# Each file contains lines: MULTITERM_ID<tab>Translation text

# Build the TRANSLATIONS object by parsing these files:
# TRANSLATIONS["de"]["99000001"] = "German text from ger.txt"
# TRANSLATIONS["en"]["99000001"] = "English text from eng.txt"
# etc.
```

If `ng-infra-multiterm` is not in the workspace, check:
1. `node_modules/@myorg/ng-infra-multiterm/` or similar
2. Product repo `src/i18n.tsx` for key → ID mappings, then look up translations
3. As last resort, use `t("99XXXXXX")` placeholders with `[MISSING]` fallback

**NEVER invent translation text.** Either extract from source or mark as `[MISSING]`.

### For Management Software (non-safety)
- State explicitly: "This software does not directly control machinery or safety-relevant processes."
- Focus safe use on: data integrity, authorization, correct configuration
- Misuse examples: unauthorized access, bypassing validation, relying on software as sole safety measure

### For HMI/Visu Software
- Include machine interaction warnings
- Reference connected PLC/safety system documentation
- Clearly delineate software boundaries vs. machine safety

### For PLC/SIL Control Software
- Include SIL level classification
- Reference safety manual
- Emergency stop procedures
- DO NOT generate safety-critical instructions without explicit engineering review

### Workflow Documentation Pattern
```html
<h3>Task: [Task Name]</h3>
<p><strong>Prerequisites:</strong> [list]</p>
<div class="step"><span class="step-num">1</span><div class="step-content">[instruction]</div></div>
<div class="step"><span class="step-num">2</span><div class="step-content">[instruction]</div></div>
<p><strong>Expected Result:</strong> [result]</p>
<p><strong>Common Pitfalls:</strong> [pitfalls]</p>
```

### Placeholder Pattern (for content that cannot be auto-extracted)
```html
<div class="box-placeholder">
  Content to be provided by product owner / technical writer.
  Required for: [regulation reference]
</div>
```

### Image Embedding Rules (for PDF compatibility)

All images MUST be embedded inline as base64 `data:` URIs so the PDF output is fully self-contained. NEVER use external `src="path/to/image.png"` references — they break in Print/PDF.

```html
<!-- ✅ CORRECT — base64 embedded, works in PDF -->
<figure>
  <img src="data:image/png;base64,iVBORw0KGgo..." alt="Descriptive alt text" style="max-width:100%;" />
  <figcaption>Figure 1: Description of the screenshot or diagram</figcaption>
</figure>

<!-- ❌ WRONG — external path, breaks in PDF -->
<img src="./screenshots/login.png" alt="Login screen" />
```

| Rule | Details |
|------|---------|
| Format | Use PNG for screenshots, SVG for diagrams/icons |
| Embedding | Always base64 inline (`data:image/png;base64,...` or inline `<svg>`) |
| Alt text | REQUIRED on every `<img>` (WCAG 2.2 AA) |
| Captions | Wrap in `<figure>` + `<figcaption>` with numbered references |
| Max width | `style="max-width:100%;"` to prevent overflow in print |
| Page breaks | `break-inside: avoid` is already set for `img` and `figure` in print CSS |
| Screenshots | If product-flow-screenshots Cypress spec exists, extract screenshots from there |
