# 🎯 AI-Guided Onboarding System for MwareX

A professional, step-by-step onboarding experience for new users with animated arrows, tooltips, and visual guidance.

## ✨ Features

- **Animated Arrows** - Pulsing, bouncing arrows that point to UI elements
- **Smart Overlays** - Semi-transparent masks that highlight specific elements
- **Tooltips** - Contextual instructions with smooth animations
- **Progress Tracking** - LocalStorage persistence - resumes on page refresh
- **Step Enforcement** - Users must follow the flow in order
- **Skip Option** - Available after first-time completion

## 📋 Onboarding Flow

### Step 1: Landing Page
- Shows overlay with arrow pointing to "Sign Up" button
- Text: "Start by creating your MwareX account"
- Blocks all other interactions

### Step 2: Signup Form
- Arrow pointing to registration form
- Text: "Fill in your details to register"
-After 3s, arrow moves to Register button

### Step 3: Dashboard - Invite Editor
- Highlights "Invite Editor" button
- Text: "Invite your editor to collaborate"

### Step 4: Invite Modal - Email Input
- Arrow pointing to email input field
- Text: "Enter your editor's Gmail address"

### Step 5: Invite Modal - Create Invitation
- Arrow moves to "Create Invitation" button
- Waits for user to click

### Step 6: Invitation Created
- Tooltip appears with success message
- Text: "✅ Great! Now send this invitation link to your editor"
- Auto-progresses after 3s

### Step 7: Waiting for Video
- Tooltip in center of screen
- Text: "Once your editor uploads a video, it will appear on your dashboard"
- Auto-progresses after 4s

### Step 8: YouTube Integration
- Highlights YouTube connect button
- Text: "Connect your YouTube channel securely"

### Step 9: Video Approval
- Points to Approve button
- Text: "Approve the video to publish it on YouTube"
- Completes onboarding

## 🛠️ Implementation

### Context Provider

The `OnboardingProvider` wraps the entire app and manages state:

```tsx
import { OnboardingProvider } from "@/contexts/OnboardingContext";

export default function RootLayout({ children }) {
  return (
    <OnboardingProvider>
      {children}
    </OnboardingProvider>
  );
}
```

### Using in Components

Import and use onboarding components per page:

```tsx
import { LandingPageOnboarding } from "@/components/onboarding";

export default function LandingPage() {
  return (
    <div>
      <LandingPageOnboarding />
      {/* Your page content */}
    </div>
  );
}
```

### Onboarding Hook

Access onboarding state anywhere:

```tsx
import { useOnboarding } from "@/contexts/OnboardingContext";

function MyComponent() {
  const {
    currentStep,
    isOnboarding,
    startOnboarding,
    completeStep,
    skipOnboarding,
    canSkip
  } = useOnboarding();

  // Use onboarding state
}
```

## 🎨 Components

### OnboardingArrow
Animated directional arrow with text:

```tsx
<OnboardingArrow
  direction="down" // up, down, left, right
  text="Click here to continue"
  position={{ top: "20%", left: "50%" }}
/>
```

### OnboardingOverlay
Semi-transparent overlay with element highlighting:

```tsx
<OnboardingOverlay
  targetSelector="#my-button" // CSS selector
  allowInteraction={true} // Allow clicking highlighted element
>
  {/* Arrow, tooltip, etc */}
</OnboardingOverlay>
```

### OnboardingTooltip
Contextual message box:

```tsx
<OnboardingTooltip
  text="This is a helpful tip!"
  position={{ top: "40%", left: "35%" }}
  showIcon={true}
/>
```

## 🎯 Data Attributes for Targeting

Add `data-onboarding` attributes to buttons for easy targeting:

```tsx
<button data-onboarding="invite-editor">
  Invite Editor
</button>

<button data-onboarding="youtube-connect">
  Connect YouTube
</button>

<button data-onboarding="approve-video">
  Approve Video
</button>
```

## 📦 localStorage State

Onboarding state is saved to `localStorage` under key `mwarex_onboarding`:

```json
{
  "currentStep": "dashboard_invite",
  "isOnboarding": true,
  "hasCompletedOnce": false
}
```

## 🔄 State Management

### Steps

1. `landing_signup` - Landing page signup CTA
2. `signup_form` - Fill registration form
3. `signup_register` - Click register button
4. `dashboard_invite` - Click invite editor
5. `invite_modal_email` - Enter editor email
6. `invite_modal_create` - Create invitation
7. `invitation_created` - Invitation success message
8. `waiting_for_video` - Waiting state
9. `youtube_connect` - Connect YouTube
10. `video_approval` - Approve video
11. `completed` - Onboarding finished

### Functions

- `startOnboarding()` - Begin onboarding flow
- `completeStep(step)` - Mark step as complete and move to next
- `skipOnboarding()` - Exit onboarding (only if `canSkip`)
- `resetOnboarding()` - Clear all data and start fresh

## 🎨 Animations

All components use `framer-motion` for smooth animations:

- **Arrows**: Pulsing glow + bouncing motion
- **Overlays**: Fade in/out with SVG mask
- **Tooltips**: Scale + slide animations
- **Highlights**: Ring pulse effect

## 📱 Responsive Design

- Works on mobile, tablet, and desktop
- Arrow positions adjust based on viewport
- Overlays work with scrolling
- Touch-friendly targets

## 🎭 Customization

### Colors

Onboarding uses your theme's primary color. Edit in `tailwind.config.js`:

```js
colors: {
  primary: "hsl(var(--primary))",
}
```

### Animation Speed

Adjust durations in component files:

```tsx
transition={{ duration: 1.5 }} // Make slower
transition={{ duration: 0.5 }} // Make faster
```

### Text

All instructional text is defined in each onboarding component file.

## 🐛 Debugging

Enable console logs by adding this to your onboarding context:

```tsx
useEffect(() => {
  console.log('[Onboarding] Current step:', currentStep);
  console.log('[Onboarding] Is active:', isOnboarding);
}, [currentStep, isOnboarding]);
```

## 🚀 Auto-Start Logic

Onboarding automatically starts for first-time visitors:

```tsx
useEffect(() => {
  const hasSeenOnboarding = localStorage.getItem("mwarex_onboarding");
  if (!hasSeenOnboarding) {
    setTimeout(() => {
      startOnboarding();
    }, 1000); // 1s delay for smooth page load
  }
}, []);
```

## ✅ Best Practices

1. **Add data attributes** to all interactive elements for reliable targeting
2. **Test the full flow** from landing page to completion
3. **Keep text concise** - users skim, not read
4. **Use appropriate delays** - not too fast, not too slow
5. **Handle edge cases** - what if button doesn't exist?

## 🔧 Troubleshooting

### Overlay doesn't highlight element
- Check CSS selector is correct
- Ensure element exists in DOM
- Try using `data-onboarding` attribute

### Step doesn't progress
- Check event listeners are attached
- Verify `completeStep()` is called
- Check console for errors

### State doesn't persist
- Verify localStorage is enabled
- Check browser privacy settings
- Clear cache and test

## 📚 Examples

See the implemented pages:
- `/src/app/page.tsx` - Landing page
- `/src/app/auth/signup/page.tsx` - Signup page
- `/src/app/dashboard/creator/page.tsx` - Creator dashboard

---

Built with ❤️ for MwareX | Powered by Framer Motion & React
