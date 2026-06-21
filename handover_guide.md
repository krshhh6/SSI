# 🚀 Complete Project Handover Guide

To completely transfer this web application to your client so that they own the code, the hosting, the database, and the security, you need to transfer **four different accounts/services**.

Follow these steps in order to ensure a smooth transition:

---

## 1. Firebase (Database & Authentication)
Firebase holds all the user data, bookings, and authentication.

1. Go to the **[Firebase Console](https://console.firebase.google.com/)** and open the `sam-wheels` project.
2. In the top left, click the **Gear Icon ⚙️** next to "Project Overview" and select **Project settings**.
3. Go to the **Users and permissions** tab.
4. Click **Add member**.
5. Enter your client's Google/Gmail email address and assign them the **Owner** role.
6. Click **Done**.
7. *Optional but recommended:* Once the client accepts the invitation and logs in, they can go to this exact same menu and remove *your* email address so they have exclusive control over the database.

---

## 2. Google reCAPTCHA v3 (Anti-Spam)
If you created the reCAPTCHA keys under your own Google account, you need to add the client.

1. Go to the **[reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)**.
2. Select the `Sam Wheels` project.
3. Click the **Gear Icon ⚙️ (Settings)** in the top right.
4. Under **Owners**, type in your client's Google email address.
5. Save the changes. 
6. Your client now owns the reCAPTCHA configuration.

---

## 3. GitHub (Source Code)
Your client needs ownership of the source code so they can make updates in the future.

1. Go to your GitHub repository (`krshhh6/SSI`).
2. Go to **Settings** > **General**.
3. Scroll all the way down to the "Danger Zone".
4. Click **Transfer ownership**.
5. Enter your client's GitHub username or email.
6. Once they accept, the repository will belong to them.

*(Note: If the client doesn't know how to use GitHub, you can alternatively just click "Code" -> "Download ZIP" and email them the code files as a backup).*

---

## 4. Vercel (Web Hosting)
Vercel is where the website lives. You need to transfer the live deployment to their account.

1. Ask your client to create a free account on **[Vercel](https://vercel.com/)** using their GitHub account.
2. Go to your Vercel Dashboard and click on the `ssi` project.
3. Go to **Settings** > **Advanced**.
4. Scroll down to **Transfer Project**.
5. Enter the client's Vercel username or Team ID.
6. **Important:** Ensure the Environment Variable (`NEXT_PUBLIC_RECAPTCHA_SITE_KEY`) transfers with the project, or tell the client to re-add it in their Vercel settings.

---

## 5. ⚠️ CRITICAL CODE UPDATE: The Admin Email
Right now, the admin panel and database security rules are hardcoded to your test email (`test01samwheels@gmail.com`). **Before you transfer the code, you MUST update this to your client's email.**

You need to change the email in exactly **two files**:

### 1. `src/components/AdminClient.tsx`
Find Line 22 and change it to the client's email:
```typescript
const ADMIN_EMAIL = "client-email@gmail.com"; // <-- Change this!
```

### 2. `firestore.rules`
Change the email in the `isAdmin()` function:
```javascript
function isAdmin() {
  return request.auth != null &&
    request.auth.token.email == 'client-email@gmail.com' && // <-- Change this!
    request.auth.token.email_verified == true;
}
```

After you make these two code changes:
1. **Push the code to GitHub.**
2. **Deploy the updated rules** to Firebase via your terminal: `firebase deploy --only firestore:rules` (or paste the new rules directly into the Firebase Console like we did before).

Once that is done, the handover is 100% complete! 🎉
