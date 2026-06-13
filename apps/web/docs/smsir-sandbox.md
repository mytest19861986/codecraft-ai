# SMS.ir Verify Manual Test

This is a controlled manual test for CodeCraft AI SMS.ir Verify infrastructure. SMS.ir Verify is also optionally wired into the bootcamp lead form for a post-save confirmation SMS. It is not wired into admin login or OTP login.

The manual script supports SMS.ir sandbox mode and a guarded production mode. Production mode may send a real SMS and may charge account credit.

## Sandbox env vars

Add these to `apps/web/.env` locally or to the server environment when testing:

```env
SMSIR_MODE=sandbox
SMSIR_API_KEY=your_sandbox_api_key
SMSIR_VERIFY_TEMPLATE_ID=123456
SMSIR_TEST_MOBILE=0912xxxxxxx
```

Never commit API keys or `.env` files.

## Create a sandbox API key

1. Sign in to the SMS.ir panel.
2. Open the API or Developers section.
3. Enable or select Sandbox mode.
4. Create a Sandbox API key.
5. Store the key only in your local or server environment as `SMSIR_API_KEY`.

The default sandbox Verify template is:

```text
templateId: 123456
template text: کد تایید شما: #CODE#
```

`SMSIR_VERIFY_TEMPLATE_ID=123456` is only the SMS.ir sandbox default. Do not use it for production.

Sandbox mode does not send real SMS and does not reduce credit.

## Production env vars

Production requires a real approved SMS.ir Verify template ID. The manual script refuses to send unless `SMSIR_REAL_SEND_ENABLED` is exactly `true`.

```env
SMSIR_MODE=production
SMSIR_API_KEY=your_production_api_key
SMSIR_VERIFY_TEMPLATE_ID=your_approved_verify_template_id
SMSIR_TEST_MOBILE=0912xxxxxxx
SMSIR_REAL_SEND_ENABLED=true
```

Production mode prints this warning before the network request:

```text
Production SMS test: a real SMS may be sent and credit may be charged.
```

Never print, log, or commit `SMSIR_API_KEY`.

## Run the manual test

From `apps/web`:

```sh
node scripts/test-smsir-verify.mjs
```

The script sends fixed code `12345` to `SMSIR_TEST_MOBILE` through the SMS.ir Verify endpoint and prints only safe structured fields:

```text
ok, httpStatus, providerStatus, message, data, error
```

The endpoint is always:

```text
https://api.sms.ir/v1/send/verify
```

Production SMS should be enabled only after the sandbox test passes and the Verify template is approved in SMS.ir.

## Bootcamp lead confirmation SMS

The bootcamp lead API can send a confirmation SMS after a lead is saved. This is optional and disabled unless `SMS_LEAD_SMS_ENABLED` is exactly `true`.

Required env vars:

```env
SMS_LEAD_SMS_ENABLED=true
SMS_LEAD_TEMPLATE_ID=your_approved_lead_verify_template_id
SMSIR_MODE=sandbox
SMSIR_API_KEY=your_smsir_api_key
```

For production lead confirmation SMS, also set the guarded production send flag:

```env
SMSIR_MODE=production
SMSIR_REAL_SEND_ENABLED=true
```

Use `SMSIR_MODE=production` only when the production Verify template is approved and account credit is ready. Production sends real SMS messages and may charge SMS.ir credit.

The lead confirmation uses the SMS.ir Verify endpoint with this template parameter:

```text
name: Code
value: ثبت‌نام
```

If a production template uses a different parameter name, adjust the small `LEAD_CONFIRMATION_PARAMETERS` mapping in `src/lib/sms/sms-ir.ts`.

Lead submission is never blocked by SMS delivery. If SMS.ir configuration is missing or the provider request fails, the lead API still returns success after the lead is saved and logs only safe server-side diagnostics. Never print, log, or commit `SMSIR_API_KEY`.
