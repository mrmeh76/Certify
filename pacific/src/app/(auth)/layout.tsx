const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
