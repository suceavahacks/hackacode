"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { string, z } from "zod"
import { useUser } from "@/utils/queries/user/getUser"
import { Loading } from "@/components/Loading"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Shield, Settings as SettingsIcon, Terminal } from "lucide-react"
import { useUpdateProfile } from "@/utils/mutations/user/settings/updateProfile"
import { useUpdateAccount } from "@/utils/mutations/user/settings/updateAccount";
import { useUpdatePrivacy } from "@/utils/mutations/user/settings/updatePrivacy";

export default function Settings() {
    const { user, loading, error } = useUser()
    const [currentSection, setCurrentSection] = useState(0)
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const router = useRouter()
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
    const toastTimeout = useRef<NodeJS.Timeout | null>(null)
    const updateProfile = useUpdateProfile();
    const updateAccount = useUpdateAccount();
    const updatePrivacy = useUpdatePrivacy();

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message })
        if (toastTimeout.current) clearTimeout(toastTimeout.current)
        toastTimeout.current = setTimeout(() => setToast(null), 3500)
    }

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
            return data.newPassword === data.confirmPassword && !!data.oldPassword && !!data.newPassword
        }
        return true
    }, {
        message: "Passwords do not match or old password is missing",
        path: ["confirmPassword"],
    })

    const privacySchema = z.object({
        show_linked_github: z.boolean(),
        show_linked_discord: z.boolean(),
        show_linked_email: z.boolean(),
        show_profile: z.boolean(),
    })

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
    })
    const accountForm = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            githubAccount: user?.github_account || "",
            discordAccount: user?.discord_account || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    })

    const privacyForm = useForm({
        resolver: zodResolver(privacySchema),
        defaultValues: {
            show_linked_github: user?.show_linked_github || false,
            show_linked_discord: user?.show_linked_discord || false,
            show_linked_email: user?.show_linked_email || false,
            show_profile: user?.show_profile || false,
        }
    })

    const sections = [
        {
            icon: User,
            label: "Profile",
            description: "Basic user details",
            form: profileForm
        },
        {
            icon: Lock,
            label: "Account",
            description: "Password & linked accounts",
            form: accountForm
        },
        {
            icon: Shield,
            label: "Privacy",
            description: "Visibility & privacy",
            form: privacyForm
        },
        {
            icon: Terminal,
            label: "CLI integration",
            description: "Configure CLI access"
        }
    ]

    useEffect(() => {
        if (!loading && !user) {
            router.push("/signin")
        }
    }, [loading, user, router])

    useEffect(() => {
        if (user) {
            profileForm.reset({
                username: user.username || "",
                full_name: user.full_name || "",
                bio: user.bio || "",
                pfp: user.profile_picture || "",
                slug: user.slug || "",
                prg_languages: user.prg_languages || [],
            })
            accountForm.reset({
                githubAccount: user.github_account || "",
                discordAccount: user.discord_account || "",
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
            privacyForm.reset({
                show_linked_github: user.show_linked_github || false,
                show_linked_discord: user.show_linked_discord || false,
                show_linked_email: user.show_linked_email || false,
                show_profile: user.show_profile || false,
            })
            setSelectedLanguages(user.prg_languages || [])
        }
    }, [user])

    if (loading) return <Loading />
    if (!user) return null

    const programmingLanguages = [
        "JavaScript", "Python", "Java", "C++", "C#",
        "Ruby", "Go", "Swift", "PHP", "TypeScript",
        "Rust", "Kotlin", "Scala", "Dart", "Haskell"
    ]

    const toggleLanguage = (language: string) => {
        let newSelectedLanguages
        if (selectedLanguages.includes(language)) {
            newSelectedLanguages = selectedLanguages.filter(lang => lang !== language)
        } else {
            newSelectedLanguages = [...selectedLanguages, language]
        }
        setSelectedLanguages(newSelectedLanguages)
        profileForm.setValue("prg_languages", newSelectedLanguages)
    }

    const onSubmit = async (data: any) => {
        if (!user) return;
        updateProfile.mutate(
            {
                id: user.id,
                username: data.username,
                full_name: data.full_name,
                bio: data.bio,
                profile_picture: data.pfp,
                slug: data.slug,
                prg_languages: selectedLanguages,
            },
            {
                onSuccess: () => showToast("success", "Profile updated successfully!"),
                onError: (err: any) => showToast("error", err.message || "Something went wrong!"),
            }
        );
    };

    const onAccountSubmit = async (data: any) => {
        if (!user) return;
        updateAccount.mutate(
            {
                id: user.id,
                githubAccount: data.githubAccount,
                discordAccount: data.discordAccount,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            },
            {
                onSuccess: () => showToast("success", "Account updated successfully!"),
                onError: (err: any) => showToast("error", err.message || "Account update failed!"),
            }
        );
    };

    const onPrivacySubmit = async (data: any) => {
        if (!user) return;
        updatePrivacy.mutate(
            {
                id: user.id,
                show_linked_github: data.show_linked_github,
                show_linked_discord: data.show_linked_discord,
                show_linked_email: data.show_linked_email,
                show_profile: data.show_profile,
            },
            {
                onSuccess: () => showToast("success", "Privacy updated successfully!"),
                onError: (err: any) => showToast("error", err.message || "Privacy update failed!"),
            }
        );
    };

    return (
        <div className="min-h-screen text-white relative z-50">
            {toast && (
                <div className="toast fixed top-4 right-4 z-50">
                    <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"}`}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
            <div className="bg-secondary border-b border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <SettingsIcon className="h-8 w-8 text-accent" />
                            <h1 className="text-3xl font-bold">Settings</h1>
                        </div>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Manage your account, privacy and CLI integration
                        </p>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-secondary rounded-xl p-6 border border-gray-800">
                                <h3 className="font-semibold text-lg mb-4">Sections</h3>
                                <nav className="space-y-2">
                                    {sections.map((section, idx) => (
                                        <button
                                            key={section.label}
                                            onClick={() => setCurrentSection(idx)}
                                            className={
                                                `w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ` +
                                                (currentSection === idx
                                                    ? "bg-accent/20 border border-accent/30"
                                                    : "hover:bg-accent hover:text-black border border-transparent")
                                            }
                                        >
                                            <div
                                                className={
                                                    `p-2 rounded-lg ` +
                                                    (currentSection === idx
                                                        ? "bg-accent/20 text-accent"
                                                        : "bg-gray-800 text-gray-400")
                                                }
                                            >
                                                <section.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="font-medium text-sm">{section.label}</div>
                                                <div className="text-xs text-gray-500">{section.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {currentSection === 0 && (
                                <form onSubmit={profileForm.handleSubmit(onSubmit)}>
                                    <div className="bg-secondary rounded-xl p-8 border border-gray-800">
                                        <div className="flex items-center gap-3 mb-6">
                                            <User className="h-6 w-6 text-accent" />
                                            <div>
                                                <h2 className="text-xl font-semibold">Profile</h2>
                                                <p className="text-gray-400 text-sm">Basic user details</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Username *
                                                </label>
                                                <input
                                                    type="text"
                                                    {...profileForm.register("username")}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors"
                                                />
                                                {profileForm.formState.errors.username && <span className="text-red-500 text-xs">{profileForm.formState.errors.username.message as string}</span>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    {...profileForm.register("full_name")}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors"
                                                />
                                                {profileForm.formState.errors.full_name && <span className="text-red-500 text-xs">{profileForm.formState.errors.full_name.message as string}</span>}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">
                                                    Biography
                                                </label>
                                                <textarea
                                                    {...profileForm.register("bio")}
                                                    rows={4}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors resize-none"
                                                />
                                                {profileForm.formState.errors.bio && <span className="text-red-500 text-xs">{profileForm.formState.errors.bio.message as string}</span>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Profile picture URL
                                                </label>
                                                <input
                                                    type="text"
                                                    {...profileForm.register("pfp")}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors"
                                                />
                                                {profileForm.formState.errors.pfp && <span className="text-red-500 text-xs">{profileForm.formState.errors.pfp.message as string}</span>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Slug *
                                                </label>
                                                <input
                                                    type="text"
                                                    {...profileForm.register("slug")}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary focus:border-accent focus:outline-none transition-colors"
                                                />
                                                {profileForm.formState.errors.slug && <span className="text-red-500 text-xs">{profileForm.formState.errors.slug.message as string}</span>}
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">
                                                    Preferred Programming Languages
                                                </label>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {programmingLanguages.map((language) => (
                                                        <button
                                                            key={language}
                                                            type="button"
                                                            onClick={() => toggleLanguage(language)}
                                                            className={
                                                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 " +
                                                                (selectedLanguages.includes(language)
                                                                    ? "btn text-white"
                                                                    : "bg-[#1E1E1F] hover:bg-[#2A2A2B]")
                                                            }
                                                        >
                                                            {language}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-4 mt-8">
                                            <button type="submit" className="btn text-white px-8 py-2 rounded">Save</button>
                                            <button type="button" onClick={() => profileForm.reset()} className="btn px-8 py-2 rounded">Reset</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {currentSection === 1 && (
                                <form onSubmit={accountForm.handleSubmit(onAccountSubmit)}>
                                    <div className="bg-secondary rounded-xl p-8 border border-gray-800">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Lock className="h-6 w-6 text-accent" />
                                            <div>
                                                <h2 className="text-xl font-semibold">Account</h2>
                                                <p className="text-gray-400 text-sm">Password & linked accounts</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Email address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={user.email || user?.identities?.[0]?.email || ""}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary opacity-60 cursor-not-allowed"
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Change your password
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input
                                                        type="password"
                                                        placeholder="Old password"
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary"
                                                        {...accountForm.register("oldPassword")}
                                                    />
                                                    <input
                                                        type="password"
                                                        placeholder="New password"
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary"
                                                        {...accountForm.register("newPassword")}
                                                    />
                                                </div>
                                                <input
                                                    type="password"
                                                    placeholder="Confirmation password"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary mt-4"
                                                    {...accountForm.register("confirmPassword")}
                                                />
                                                {accountForm.formState.errors.confirmPassword && (
                                                    <span className="text-red-500 text-xs">{accountForm.formState.errors.confirmPassword.message as string}</span>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Enable 2FA (only for email identity)
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                                    className={
                                                        "btn " + (twoFactorEnabled ? "btn-active" : "")
                                                    }
                                                >
                                                    {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    GitHub account
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="https://github.com/yourusername"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary"
                                                    {...accountForm.register("githubAccount")}
                                                />
                                                {accountForm.formState.errors.githubAccount && <span className="text-red-500 text-xs">{accountForm.formState.errors.githubAccount.message as string}</span>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Discord account
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="discord username"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-secondary"
                                                    {...accountForm.register("discordAccount")}
                                                />
                                                {accountForm.formState.errors.discordAccount && <span className="text-red-500 text-xs">{accountForm.formState.errors.discordAccount.message as string}</span>}
                                            </div>
                                        </div>
                                        <div className="flex space-x-4 mt-8">
                                            <button type="submit" className="btn text-white px-8 py-2 rounded">Save</button>
                                            <button type="button" onClick={() => accountForm.reset()} className="btn px-8 py-2 rounded">Reset</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {currentSection === 2 && (
                                <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)}>
                                    <div className="bg-secondary rounded-xl p-8 border border-gray-800">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Shield className="h-6 w-6 text-accent" />
                                            <div>
                                                <h2 className="text-xl font-semibold">Privacy</h2>
                                                <p className="text-gray-400 text-sm">Visibility & privacy</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" {...privacyForm.register("show_profile")} id="show_profile" className="mr-2" />
                                                <label htmlFor="show_profile" className="text-sm">Show my profile to everyone</label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" {...privacyForm.register("show_linked_github")} id="show_linked_github" className="mr-2" />
                                                <label htmlFor="show_linked_github" className="text-sm">Show my linked GitHub account</label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" {...privacyForm.register("show_linked_discord")} id="show_linked_discord" className="mr-2" />
                                                <label htmlFor="show_linked_discord" className="text-sm">Show my linked Discord account</label>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" {...privacyForm.register("show_linked_email")} id="show_linked_email" className="mr-2" />
                                                <label htmlFor="show_linked_email" className="text-sm">Show my linked email address</label>
                                            </div>
                                        </div>
                                        <div className="flex space-x-4 mt-8">
                                            <button type="submit" className="btn text-white px-8 py-2 rounded">Save</button>
                                            <button type="button" onClick={() => privacyForm.reset()} className="btn px-8 py-2 rounded">Reset</button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {currentSection === 3 && (
                                <div className="bg-secondary rounded-xl p-8 border border-gray-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Terminal className="h-6 w-6 text-accent" />
                                        <div>
                                            <h2 className="text-xl font-semibold">CLI integration</h2>
                                            <p className="text-gray-400 text-sm">Configure CLI access</p>
                                        </div>
                                    </div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}