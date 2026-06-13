# SMS.ir Verify Manual Test

This is a controlled manual test for CodeCraft AI SMS.ir Verify infrastructure. It is not wired into the bootcamp lead form, admin login, OTP login, or any production user flow.

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
