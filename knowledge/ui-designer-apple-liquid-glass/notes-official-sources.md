# Notes from the official sources (read 2026-11-21)

Source: notes taken from Apple's Human Interface Guidelines, Apple Developer documentation, and MDN Web Docs on 2026-11-21. Quotes are verbatim; everything else is a summary. Apple's HTML pages need JavaScript, so the Apple pages were read through their JSON versions (`https://developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`). Coverage notes say what could not be read; check the live page before relying on anything marked "not read".

## Apple HIG — Materials (Liquid Glass)
https://developer.apple.com/design/human-interface-guidelines/materials — first ~40,000 of 76,500 characters read verbatim.

- Liquid Glass "forms a distinct functional layer for controls and navigation elements — like tab bars and sidebars — that floats above the content layer."
- "Don't use Liquid Glass in the content layer." Use standard materials for content-layer elements such as app backgrounds.
- Controls such as sliders and toggles may take on a glass look only while being activated (transient).
- "Use Liquid Glass effects sparingly." Standard components adopt it automatically; limit custom effects "to the most important functional elements."
- **Regular variant:** "blurs and adjusts the luminosity of background content to maintain legibility." Use it "when background content might create legibility issues, or when components have a significant amount of text, such as alerts, sidebars, or popovers." Most system components use it.
- **Clear variant:** "highly translucent." "Only use clear Liquid Glass for components that appear over visually rich backgrounds."
- Over bright content: "consider adding a dark dimming layer of 35% opacity." Not needed if the content is "sufficiently dark."
- Scroll edge effects "further enhance legibility by blurring and reducing the opacity of background content."
- "Help ensure legibility by using vibrant colors on top of materials."
- "Thicker materials, which are more opaque, can provide better contrast"; thinner ones "retain their context." Standard iOS materials: ultra-thin, thin, regular (default), thick.
- Appearance "can differ in response to certain system settings," including reduced transparency and increased contrast (exact adaptation not in the part read).

## Apple — Adopting Liquid Glass
https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass — first ~40,000 of 152,000 characters read verbatim (JSON version).

- Liquid Glass is "a new dynamic material called Liquid Glass, which combines the optical properties of glass with a sense of fluidity."
- "Liquid Glass applies to the topmost layer of the interface, where you define your navigation." Tab bars and sidebars "float in this Liquid Glass layer to help people focus on the underlying content."
- "Ensure that you clearly separate your content from navigation elements, like tab bars and sidebars, to establish a distinct functional layer above the content layer."
- "Reduce your use of custom backgrounds in controls and navigation elements." "Prefer to remove custom effects and let the system determine the background appearance."
- "Avoid overusing Liquid Glass effects." "Limit these effects to the most important functional elements in your app." "avoid overcrowding or layering Liquid Glass elements on top of each other."
- "Be judicious with your use of color in controls and navigation so they stay legible." Custom colors need "an increased contrast option for each variant."
- "Optimize for legibility when content scrolls beneath controls" (scroll edge effect).
- "Consider adapting your tab bar into a sidebar automatically." "Choose whether to automatically minimize your tab bar in iOS."
- Sidebars: "Check content safe areas for sidebars and inspectors"; "Extend content beneath sidebars and inspectors."
- Toolbars: "Group items that perform similar actions"; "Consider representing common actions in toolbars with standard icons instead of text."
- Controls: "Prefer to use standard spacing metrics instead of overriding them." "Consider aligning the shape of controls with other rounded elements" (concentric shapes).
- "Test your interface with a variety of display and accessibility settings" — people "can turn on accessibility settings that reduce transparency or motion."
- "Provide an accessibility label for every icon."

## Apple HIG — Color
https://developer.apple.com/design/human-interface-guidelines/color — first ~40,000 of 182,000 characters read verbatim; dark-mode and contrast sections at the end not read.

- "Avoid using the same color to mean different things."
- "Make sure all your app's colors work well in light, dark, and increased contrast contexts." Supply "an increased contrast option for each variant that provides a significantly higher amount of visual differentiation."
- "Even if your app ships in a single appearance mode, provide both light and dark colors to support Liquid Glass adaptivity."
- "Avoid relying solely on color to differentiate between objects, indicate interactivity, or communicate essential information."
- "Avoid hard-coding system color values"; dynamic colors are "semantically defined by its purpose, rather than its appearance."
- Liquid Glass "has no inherent color." "Apply color sparingly to the Liquid Glass material, and to symbols or text on the material." Emphasize primary actions by coloring the control background.

## Apple HIG — Typography
https://developer.apple.com/design/human-interface-guidelines/typography — first ~40,000 of 281,000 characters read verbatim.

- "Use font sizes that most people can read easily." Default/minimum sizes: iOS/iPadOS **17pt / 11pt**; macOS 13pt / 10pt; visionOS 17 / 12; watchOS 16 / 12; tvOS 29 / 23.
- "In general, avoid light font weights." "Minimize the number of typefaces you use."
- "If you need to display three or more lines of text, avoid tight leading."
- "Make sure your app's layout adapts to all font sizes"; minimize truncation; "Reduce the number of columns when the font size increases."
- Body at the default (Large) size is 17pt (model-extracted from the table; verify); accessibility sizes go up to 53pt.

## Apple — Fonts and license
https://developer.apple.com/fonts/ — read in full; the San Francisco license text is on the page itself.

- Fonts: SF Pro, SF Compact, SF Mono, New York, SF Arabic/Armenian/Georgian/Hebrew.
- Allowed: use "solely for creating mock-ups of user interfaces to be used in software products running on Apple's iOS, OS X or tvOS operating systems," by registered Apple Developers.
- Forbidden: "You may not embed the Apple Font in any software programs or other products." "you may not use the Apple Font to, create, develop, display or otherwise distribute any documentation, artwork, website content or any other work product." No network sharing; no modification; no transfer.
- **Consequence for us: never self-host or `@font-face` SF fonts on a website.** Use `-apple-system, BlinkMacSystemFont, …`, which shows the font already installed on the visitor's Apple device.

## Apple HIG — Layout
https://developer.apple.com/design/human-interface-guidelines/layout — first ~40,000 of 85,000 characters read verbatim.

- "Order content by relative importance" — most important "near the top and leading side."
- "Group related items"; "Use progressive disclosure"; "Use consistent spacing."
- "Instead of applying a solid or semi-opaque background color beneath controls, use a scroll edge effect to visually elevate controls above content."
- "Determine layout based on size classes, not device type or orientation"; a tab bar can become a sidebar at larger widths.
- "Be prepared for text-size changes." macOS: "Avoid placing controls or critical information at the bottom of a window."

## Apple HIG — Accessibility
https://developer.apple.com/design/human-interface-guidelines/accessibility — first ~40,000 of 85,000 characters read verbatim.

- "Ideally, give people the option to enlarge text by at least 200 percent."
- Contrast (WCAG AA): text up to 17pt needs **4.5:1**; 18pt+ and bold text **3:1**. Provide a higher-contrast scheme when Increase Contrast is on; check light and dark.
- "Offer visual indicators, like distinct shapes or icons, in addition to color."
- Targets: iOS/iPadOS default **44×44pt**, minimum 28×28pt (macOS 28/20, visionOS 60/28, watchOS 44/28, tvOS 66/56).
- "Consider spacing between controls as important as size" — ~12pt padding around bezeled elements, ~24pt around unbezeled ones.
- Reduce Motion: reduce "automatic and repetitive animations, including zooming, scaling, and peripheral motion"; "Replacing transitions in x-, y-, and z-axes with fades"; "Avoiding animating into and out of blurs."
- "Let people use the keyboard alone to navigate and interact with your app." Label everything for VoiceOver.

## Apple HIG — Tab bars
https://developer.apple.com/design/human-interface-guidelines/tab-bars — first ~40,000 of 53,000 characters read verbatim.

- "Use a tab bar to support navigation, not to provide actions."
- "Make sure the tab bar is visible when people navigate to different sections of your app."
- "It's generally easier to navigate among fewer tabs." "Avoid overflow tabs."
- "Don't disable or hide tab bar buttons, even when their content is unavailable."
- "Include tab labels"; "Use single words whenever possible." "Prefer filled symbols or icons."
- "Reserve badges for critical information."
- Liquid Glass on iOS: "A tab bar floats above content at the bottom of the screen. Its items rest on a Liquid Glass background that allows content beneath to peek through." It can minimize on scroll.
- iPadOS: tab bar near the top, convertible to a sidebar; customizable tabs: "aim for a default list of five or fewer."

## Apple HIG — Sidebars
https://developer.apple.com/design/human-interface-guidelines/sidebars — read in full.

- "A sidebar requires a large amount of vertical and horizontal space"; where space is tight, a tab bar is better. "Consider using a tab bar first."
- Sidebars "can float above content in the Liquid Glass layer"; extend content beneath them.
- "In general, show no more than two levels of hierarchy in a sidebar"; title groups with "succinct, descriptive labels."
- "Avoid hiding the sidebar by default." "Avoid putting critical information or actions at the bottom of a sidebar."
- "Make sure any sidebar icon colors you choose serve a clear purpose."

## MDN — backdrop-filter
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter

- "lets you apply graphical effects such as blurring or color shifting to the area behind an element. Because it applies to everything behind the element, to see the effect the element or its background needs to be transparent or partially transparent."
- Values: `none`, an SVG filter `url()`, or filter functions — `blur()`, `brightness()`, `contrast()`, `drop-shadow()`, `grayscale()`, `hue-rotate()`, `invert()`, `opacity()`, `saturate()`, `sepia()` — combinable: `backdrop-filter: blur(4px) saturate(150%)`.
- Applies "up to the nearest ancestor that is a backdrop root."
- Practice (not quoted from MDN): also write `-webkit-backdrop-filter` for older Safari versions.

## MDN — prefers-reduced-transparency
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency

- "used to detect if a user has enabled a setting on their device to reduce the transparent or translucent layer effects."
- Values: `no-preference`, `reduce`.
- OS settings: Windows 10/11 Settings > Personalization > Colors > Transparency effects; macOS System Settings > Accessibility > Display > Reduce transparency; iOS Settings > Accessibility > Display & Text Size > Reduce Transparency.
- Status: **Experimental, "Limited availability", "not Baseline"** — Chrome and Edge 118+. Always pair with other fallbacks.

## MDN — prefers-contrast
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-contrast

- "used to detect whether the user has requested the web content to be presented with a lower or higher contrast."
- Values: `no-preference`, `more`, `less`, `custom` (`custom` matches users of `forced-colors: active` whose palette is neither more nor less contrast).
- Example: `@media (prefers-contrast: more) { .contrast { outline: 2px solid black; } }`

## MDN — prefers-reduced-motion
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion

- "used to detect if a user has enabled a setting on their device to minimize the amount of non-essential motion."
- Animations "can trigger discomfort for those with vestibular motion disorders. Animations such as scaling or panning large objects can be vestibular motion triggers."
- Values: `no-preference`, `reduce` (`@media (prefers-reduced-motion)` = `reduce`). Well established across browsers.
- OS settings: macOS 26+ System Settings > Accessibility > Motion > Reduce motion (macOS ≤ 15: Display); iOS Settings > Accessibility > Motion; Windows 11 Settings > Accessibility > Visual Effects > Animation Effects; Android 9+ Remove animations.
