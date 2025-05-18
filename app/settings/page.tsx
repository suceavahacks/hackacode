"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { useUser } from "@/utils/queries/user/getUser";
import { Loading } from "@/components/Loading";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";


export default function Settings() {
    const { user, loading, error } = useUser();
    const [currentTab, setCurrentTab] = useState("Profile");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const toastTimeout = useRef<NodeJS.Timeout | null>(null);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        if (toastTimeout.current) clearTimeout(toastTimeout.current);
        toastTimeout.current = setTimeout(() => setToast(null), 3500);
    };

    const profileSchema = z.object({
        username: string().min(3, "Username must be at least 3 characters long"),
        full_name: string().min(3, "Full name must be at least 6 characters long"),
        bio: string().max(160, "Bio must be at most 160 characters long"),
        pfp: string().url("Profile picture must be a valid URL"),
        slug: string().min(3, "Slug must be at least 3 characters long"),
        prg_languages: z.array(string()).optional(),
    })

    const accountSchema = z.object({
        githubAccount: string()
            .url("GitHub account must be a valid URL")
            .or(string().length(0))
            .optional(),
        discordAccount: string()
            .min(3, "Discord account must be at least 3 characters long")
            .or(string().length(0))
            .optional(),
        oldPassword: string().optional(),
        newPassword: string().optional(),
        confirmPassword: string().optional(),
    }).refine((data) => {
        if (data.newPassword || data.confirmPassword) {
            return data.newPassword === data.confirmPassword && !!data.oldPassword && !!data.newPassword;
        }
        return true;
    }, {
        message: "Passwords do not match or old password is missing",
        path: ["confirmPassword"],
    });

    const privacySchema = z.object({
        show_linked_github: z.boolean(),
        show_linked_discord: z.boolean(),
        show_linked_email: z.boolean(),
        show_profile: z.boolean(),
    });

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user?.username || "",
            full_name: user?.full_name || "",
            bio: user?.bio || "",
            pfp: user?.profile_picture || "",
            slug: user?.slug || "",
            prg_languages: user?.prg_languages || [],
        }
    });
    const accountForm = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            githubAccount: user?.github_account || "",
            discordAccount: user?.discord_account || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });

    const privacyForm = useForm({
        resolver: zodResolver(privacySchema),
        defaultValues: {
            show_linked_github: user?.show_linked_github || false,
            show_linked_discord: user?.show_linked_discord || false,
            show_linked_email: user?.show_linked_email || false,
            show_profile: user?.show_profile || false,
        }
    });

    const form = currentTab === 'Profile' ? profileForm : currentTab === 'Account' ? accountForm : privacyForm;


    const resetForm = () => {
        const { reset } = form;
        if (currentTab === 'Profile') {
            reset({
                username: user?.username || "",
                full_name: user?.full_name || "",
                bio: user?.bio || "",
                pfp: user?.profile_picture || "",
                slug: user?.slug || "",
                prg_languages: user?.prg_languages || [],
            });
        } else if (currentTab === 'Account') {
            reset({
                githubAccount: user?.github_account || "",
                discordAccount: user?.discord_account || "",
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } else if (currentTab === 'Privacy') {
            reset({
                show_linked_github: user?.show_linked_github || false,
                show_linked_discord: user?.show_linked_discord || false,
                show_linked_email: user?.show_linked_email || false,
                show_profile: user?.show_profile || false,
            });
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push("/signin");
        }
    }, [loading, user, router]);

    const { register, handleSubmit, setValue, formState: { errors } } = form;

    const toggleLanguage = (language: string) => {
        let newSelectedLanguages;
        if (selectedLanguages.includes(language)) {
            newSelectedLanguages = selectedLanguages.filter(lang => lang !== language);
        } else {
            newSelectedLanguages = [...selectedLanguages, language];
        }
        setSelectedLanguages(newSelectedLanguages);
    };

    const programmingLanguages = [
        "JavaScript", "Python", "Java", "C++", "C#",
        "Ruby", "Go", "Swift", "PHP", "TypeScript",
        "Rust", "Kotlin", "Scala", "Dart", "Haskell"
    ];

    const onSubmit = async (data: any) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from("users")
                .update({
                    username: data.username,
                    full_name: data.full_name,
                    bio: data.bio,
                    profile_picture: data.pfp,
                    slug: data.slug,
                    prg_languages: selectedLanguages,
                })
                .eq("id", user.id);

            if (error) {
                showToast("error", error.message || "Something went wrong!");
                return;
            }
            showToast("success", "Profile updated successfully!");
        } catch (err: any) {
            showToast("error", err.message || "Something went wrong!");
        }
    };

    const onAccountSubmit = async (data: any) => {
        if (!user) return;

        const updateData: Record<string, any> = {
            githubAccount: data.githubAccount,
            discordAccount: data.discordAccount,
            // two_factor_enabled: twoFactorEnabled to be implemented
        };

        if (data.oldPassword && data.newPassword) {
            try {
                const { error } = await supabase.auth.updateUser({
                    password: data.newPassword
                });

                if (error) {
                    showToast("error", error.message || "Password update failed!");
                    return;
                }
            } catch (error: any) {
                showToast("error", error.message || "Password update failed!");
                return;
            }
        }

        const { error } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", user.id);

        if (error) {
            showToast("error", error.message || "Account update failed!");
            return;
        }
        showToast("success", "Account updated successfully!");
    };

    const resetAccountForm = () => {
        if (!user) return;

        form.reset({
            githubAccount: user.github_account || "",
            discordAccount: user.discord_account || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setTwoFactorEnabled(!!user.two_factor_enabled);
    };

    const onPrivacySubmit = async (data: any) => {
        if (!user) return;
        const { error } = await supabase
            .from("users")
            .update({
                show_linked_github: data.show_linked_github,
                show_linked_discord: data.show_linked_discord,
                show_linked_email: data.show_linked_email,
                show_profile: data.show_profile,
            })
            .eq("id", user.id);
        if (error) {
            showToast("error", error.message || "Privacy update failed!");
            return;
        }
        showToast("success", "Privacy updated successfully!");
    };

    useEffect(() => {
        if (user) {
            profileForm.reset({
                username: user.username || "",
                full_name: user.full_name || "",
                bio: user.bio || "",
                pfp: user.profile_picture || "",
                slug: user.slug || "",
                prg_languages: user.prg_languages || [],
            });
            accountForm.reset({
                githubAccount: user.github_account || "",
                discordAccount: user.discord_account || "",
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            privacyForm.reset({
                show_linked_github: user.show_linked_github || false,
                show_linked_discord: user.show_linked_discord || false,
                show_linked_email: user.show_linked_email || false,
                show_profile: user.show_profile || false,
            });
            setSelectedLanguages(user.prg_languages || []);
        }
    }, [user]);

    if (loading) return <Loading />;
    if (!user) return null;

    const tabs = ['Profile', 'Account', 'Privacy', 'CLI integration']

    return (
        <div className="flex flex-col ml-24 max-md:ml-2 h-[1200px] max-w-[1000px] mr-2">
            {toast && (
                <div className="toast">
                    <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"}`}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
            <div className="flex flex-row items-start mt-16 overflow-x-auto">
                {tabs.map((tab) => (
                    <button key={tab}
                        className={`px-4 py-2 text-3xl max-md:text-xl font-light ${currentTab === tab ? 'border-b-2 border-green-500' : 'opacity-40'} hover:opacity-70`}
                        onClick={() => setCurrentTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {currentTab === 'Profile' && (() => {
                const { register, handleSubmit, formState: { errors } } = profileForm;
                return (
                    <div className="flex flex-col items-start mt-10 ml-2">
                        <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
                            <label htmlFor="username" className="text-xl opacity-70">Username</label>
                            <input
                                {...register("username")}
                                type="text"
                                id="username"
                                className="bg-[#1E1E1F] rounded p-2 mt-2"

                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                            {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
                            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
                            {errors.pfp && <p className="text-red-500 text-sm mt-1">{errors.pfp.message}</p>}
                            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}

                            <label htmlFor="full_name" className="text-xl opacity-70 mt-4">Full name</label>
                            <input
                                {...register("full_name")}
                                type="text"
                                id="full_name"
                                className="bg-[#1E1E1F] rounded p-2 mt-2"
                            />

                            <label htmlFor="bio" className="text-xl opacity-70 mt-4">Biography</label>
                            <textarea
                                {...register("bio")}
                                id="bio"
                                className="bg-[#1E1E1F] h-[200px] rounded p-2 mt-2"
                            />

                            <label htmlFor="pfp" className="text-xl opacity-70 mt-4">Profile picture</label>
                            <input
                                {...register("pfp")}
                                type="text"
                                id="pfp"
                                className="bg-[#1E1E1F] rounded p-2 mt-2"
                            />

                            <div className="mt-2">
                                <label htmlFor="prg_languages" className="text-xl opacity-70 mb-2 block">
                                    Choose your preferred programming languages
                                </label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {programmingLanguages.map((language) => (
                                        <button
                                            key={language}
                                            type="button"
                                            onClick={() => toggleLanguage(language)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200
                                                ${selectedLanguages.includes(language)
                                                    ? 'btn text-white'
                                                    : 'bg-[#1E1E1F] hover:bg-[#2A2A2B]'}`}
                                        >
                                            {language}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <label htmlFor="slug" className="text-xl opacity-70 mt-4">Slug</label>
                            <input
                                {...register("slug")}
                                type="text"
                                id="slug"
                                className="bg-[#1E1E1F] rounded p-2 mt-2"
                            />

                            <div className="flex space-x-4 mt-8">
                                <button type="submit" className="btn text-white px-8 py-2 rounded">Save</button>
                                <button type="button" onClick={() => profileForm.reset()} className="btn px-8 py-2 rounded">Reset</button>
                            </div>
                        </form>
                    </div>
                );
            })()}

            {currentTab === 'Account' && (() => {
                const { register, handleSubmit, formState: { errors } } = accountForm;
                return (
                    <div className="flex flex-col items-start mt-10 ml-2 w-full">
                        <form className="flex flex-col w-full" onSubmit={handleSubmit(onAccountSubmit)}>
                            <label htmlFor="email" className="text-xl opacity-70">Email address</label>
                            <input
                                type="email"
                                id="email"
                                value={user.email || user?.identities?.[0]?.email || ""}
                                className="bg-[#1E1E1F] rounded p-2 mt-2 cursor-not-allowed blur-sm hover:blur-0"
                                disabled
                            />

                            <div className="mt-6">
                                <label className="text-xl opacity-70">Change your password</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <input
                                        type="password"
                                        placeholder="old password"
                                        className="bg-[#1E1E1F] rounded p-2"
                                        {...register("oldPassword")}
                                    />
                                    <input
                                        type="password"
                                        placeholder="new password"
                                        className="bg-[#1E1E1F] rounded p-2"
                                        {...register("newPassword")}
                                    />
                                </div>
                                <input
                                    type="password"
                                    placeholder="confirmation password"
                                    className="bg-[#1E1E1F] rounded p-2 mt-4 w-full"
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="mt-6">
                                <label className="text-xl opacity-70 block mb-2">Enable 2FA (only for email identity)</label>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                        className={`btn ${twoFactorEnabled ? 'btn-active' : ''}`}
                                    >
                                        {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label htmlFor="github" className="text-xl opacity-70">Link your GitHub account</label>
                                <input
                                    type="text"
                                    id="github"
                                    placeholder="https://github.com/yourusername"
                                    className="bg-[#1E1E1F] rounded p-2 mt-2 w-full"
                                    {...register("githubAccount")}
                                />
                                 {errors.githubAccount && <p className="text-red-500 text-sm mt-1">{errors.githubAccount.message}</p>}
                            </div>

                            <div className="mt-6">
                                <label htmlFor="discord" className="text-xl opacity-70">Link your Discord account</label>
                                <input
                                    type="text"
                                    id="discord"
                                    placeholder="discord username"
                                    className="bg-[#1E1E1F] rounded p-2 mt-2 w-full"
                                    {...register("discordAccount")}
                                />
                                {errors.discordAccount && <p className="text-red-500 text-sm mt-1">{errors.discordAccount.message}</p>}
                            </div>

                            <div className="flex space-x-4 mt-8">
                               <button type="submit" className="btn text-white px-8 py-2 rounded">Save</button>
                                <button type="button" onClick={resetAccountForm} className="btn px-8 py-2 rounded">Reset</button>
                            </div>
                        </form>
                    </div>
                );
            })()}

            {currentTab === 'Privacy' && (() => {
                const { register, handleSubmit, formState: { errors } } = privacyForm;
                return (
                    <div className="flex flex-col items-start mt-10 ml-2 w-full">
                        <form className="flex flex-col w-full" onSubmit={handleSubmit(onPrivacySubmit)}>
                            <label htmlFor="who_can_see_profile" className="text-xl opacity-70">Who can see your profile</label>
                            <div className="flex space-x-4 mt-2">
                                <button type="button" className="btn w-[300px]">Everyone</button>
                                <button type="button" className="btn w-[300px] opacity-30">Only me</button>
                            </div>
                            <label htmlFor="show_linked_github" className="text-xl opacity-70 mt-6">
                                Who can see your linked GitHub account
                            </label>
                            <div className="flex space-x-4 mt-2">
                                <button type="button" className="btn w-[300px]">Everyone</button>
                                <button type="button" className="btn w-[300px] opacity-30">Only me</button>
                            </div>
                            <label htmlFor="show_linked_discord" className="text-xl opacity-70 mt-6">
                                Who can see your linked Discord account
                            </label>
                            <div className="flex space-x-4 mt-2">
                                <button type="button" className="btn w-[300px] opacity-30">Everyone</button>
                                <button type="button" className="btn w-[300px]">Only me</button>
                            </div>
                            <label htmlFor="show_linked_email" className="text-xl opacity-70 mt-6">
                                Who can see your linked email address
                            </label>
                            <div className="flex space-x-4 mt-2">
                                <button type="button" className="btn w-[300px] opacity-30">Everyone</button>
                                <button type="button" className="btn w-[300px]">Only me</button>
                            </div>
                        </form>
                    </div>
                );
            })()}

            {currentTab === 'CLI integration' && (
                <div className="flex flex-col items-start mt-10 ml-2 w-full">
                    <div className="mockup-code w-full bg-secondary mb-4">
                        <pre data-prefix="">
                            <code># Linux/macOS</code>
                        </pre>
                        <pre data-prefix="">
                            <code>echo "[settings]" &gt; ~/.hackacode.cfg</code>
                        </pre>
                        <pre data-prefix="">
                            <code>echo 'api_url = "https://api.hackacode.xyz/cli"' &gt;&gt; ~/.hackacode.cfg</code>
                        </pre>
                        <pre data-prefix="">
                            <code>echo 'api_key = "api_key - soon"' &gt;&gt; ~/.hackacode.cfg</code>
                        </pre>
                    </div>
                    <div className="mockup-code w-full bg-secondary mb-4 mt-4">
                        <pre data-prefix="">
                            <code># Windows PowerShell</code>
                        </pre>
                        <pre data-prefix="">
                            <code>echo [settings] &gt; $HOME\.hackacode.cfg</code>
                        </pre>
                        <pre data-prefix="">
                            <code>echo api_url = "https://api.hackacode.xyz/cli" &gt;&gt; $HOME\.hackacode.cfg</code>
                        </pre>
                        <pre data-prefix="">
                            <code>echo api_key = "api_key - soon" &gt;&gt; $HOME\.hackacode.cfg</code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}