# WhatsApp Web API

Simple API to send messages to WhatsApp using WhatsApp Web.

## Install

```bash
npm install
```

## Run

```bash
npm run start
```

## How to use

### Login

1. Go to `http://localhost:3000/whatsapp/login`
2. Scan the QR code with your WhatsApp account

### Send Message

1. POST: `http://localhost:3000/whatsapp/sendmessage`
2. Body:

```json
{
	"phone": "963957999999", // phone number with country code
	"message": "Hello, world!"
}
```

3. Headers:

```json
{
	"x-password": "1234567890" // password from .env
}
```

## Notes

-   The phone number must be in the format of the country code and the phone number without the + sign.
-   The message must be in the format of the message to be sent.
-   The password is the password from the .env file.

## Integration with Laravel

You can use the following code to send a message to WhatsApp using the API.

```php
use Illuminate\Support\Facades\Http;
$response = Http::withHeaders([
  'x-password' => '1234567890'
])->post('http://localhost:3000/whatsapp/sendmessage', [
  'phone' => '963957999999',
  'message' => 'Hello, world!',
]);
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes and commit them
4. Push to your branch
5. Create a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
