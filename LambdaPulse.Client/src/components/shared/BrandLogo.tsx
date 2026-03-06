import logo from "../../assets/logo96.png";

export const BrandLogo = () => {
  return (
    <div className="flex items-center px-4 py-6">
      <img src={logo} className="w-6 h-6 mb-1" alt="Lambda Pulse Logo" />
      <h1 className="text-2xl ml-1">
        <span className="font-bold">Lambda</span>
        <span className="font-normal">Pulse</span>
      </h1>
    </div>
  );
};
