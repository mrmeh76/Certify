import Mail from "@/mail/mail";
export async function POST(request: Request) {
  try {
    const { password, email } = await request.json();
    await Mail.sendMail(
      `
        <h1>Certify Student Account Details</h1>
        <p>This is your password ${password}. Please do not share with anyone else</p>
        <p>Connect your wallet to your student account using the above password</p>
    `,
      'Certify <accounts@pacify.co.ke>',
      email,
      "Student Account Details"
    );
    console.log("Email Sent To:", email);

    return Response.json({ message: "Email Sent" });
  } catch (error) {
    return Response.json({ error });
  }
}