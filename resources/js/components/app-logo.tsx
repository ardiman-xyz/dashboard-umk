export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-md">
                {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
                <img src="/images/logo1.png" alt="logo" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">SATUDATA UMK</span>
            </div>
        </>
    );
}
