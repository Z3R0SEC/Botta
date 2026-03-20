# Tutorial: Setting Up Botta

## 📌 Prerequisites
- You must have a **Facebook Page**.  
- If you don’t have one, create a Facebook Page first.

---

## 🚀 Step 1: Go to Facebook Developers
1. Open [Facebook Developers](https://developers.facebook.com) in your browser.
2. Log in with your Facebook credentials.
3. If you’re new, follow the prompts to create a **Developer Account**.

---

## 🛠 Step 2: Create an App
1. Click **My Apps** (top-right).
2. Select **Create App**.
3. Choose **Business** as the app type.
4. Fill in details (app name, contact email).
5. Click **Create App ID**.

---

## 💬 Step 3: Add Messenger Product
1. In the app dashboard sidebar, click **Add Product**.
2. Find **Messenger** and click **Set Up**.

---

## 🔗 Step 4: Connect Your Facebook Page
1. Scroll to **Access Tokens**.
2. Click **Add or Remove Pages**.
3. Connect your Facebook Page.
4. Generate a **Page Access Token** and copy it.

---

## 🌐 Step 5: Set Up Webhooks
1. In Messenger settings, go to **Webhooks**.
2. Click **Setup Webhooks**.
3. Enter:
   - **Callback URL:** `https://your_hosting.site/webhook`
   - **Verify Token:** `motadev`
4. Subscribe to:
   - `messages`
   - `messaging_optins`
   - `messaging_postbacks`
5. Click **Verify and Save**.

---

## 📩 Step 6: Add Page Subscriptions
1. Under **Page Subscriptions**, select your connected page.
2. Ensure `messages`, `messaging_optins`, and `messaging_postbacks` are checked.

---

## 🔑 Step 7: Get Your Page Access Token
1. Return to **Access Tokens**.
2. Copy the generated token.

---

## ⚙️ Step 8: Configure Bot with Token
- Paste the **Page Access Token** into `token.txt`.

---

## 🧪 Step 9: Test Your Messenger Bot
1. Open your connected Facebook Page.
2. Send a message (e.g., "help") from another account.
3. Ensure the testing account has a role in the app.

---

## 📌 Note
- The bot only responds to accounts with assigned roles if fb app is not live.

---

## 👥 Adding Roles
1. Go to [Facebook Developers](https://developers.facebook.com).
2. Log in and access your app dashboard.
3. Select **App Roles**.
4. Click **Add Role**.
5. Define role details (name, permissions).
6. Assign roles to users (via name or user ID).

---

## 🙌 Credits
- Created by **Mota Dev**  
- For donations -> ([Paypal](https://www.paypal.com/donate/?hosted_button_id=W43QVBM7HREZQ))  
- My Website -> ([motadev](https://motadev.xyz))  
