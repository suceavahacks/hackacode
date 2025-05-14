'use client'
import { useState, useEffect } from "react";
import { useUser } from "@/utils/queries/user/getUser";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

const Avatar = () => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const { user } = useUser();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const supabase = createClient();
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("profile_picture")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          return;
        }

        if (data) {
          setProfilePicture(data.profile_picture);
        }
      } catch (error) {
        return;
      }
    };

    fetchProfilePicture();
  }, [user?.id]);

  if (!user) return null;

  const avatarUrl = profilePicture

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAvatarModalOpen(true);
  };

  const closeModal = () => {
    setIsAvatarModalOpen(false);
  };

  const updateProfilePicture = async (url: string) => {
    const { error } = await supabase
      .from("users")
      .update({ profile_picture: url })
      .eq("id", user.id);
      
    if (error) {
      return;
    }
    console.log('ok')
    setProfilePicture(url);
  }

  return (
    <div className="relative">
      <img
        src={avatarUrl || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
        alt="User Avatar"
        onClick={openModal}
        className="cursor-pointer rounded-full object-cover w-full h-full"
      />

      {isAvatarModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-secondary p-6 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Profile Picture</h3>
            </div>
            <p className="text-center">These pictures are from your identities. Click on them to view them in full size.</p>
            <div className="py-4 flex justify-evenly flex-wrap">
              {user.identities?.map((identity: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="flex flex-col gap-5 items-center">
                    <img
                      src={identity.identity_data.avatar_url}
                      alt="Avatar"
                      className="rounded-full object-cover hover:border-white hover:border-2 cursor-pointer "
                      style={{ width: 80, height: 80 }}
                      onClick={() => {
                        const newWindow = window.open(identity.identity_data.avatar_url, "_blank");
                        if (newWindow) newWindow.focus();
                      }}
                    />
                    <button
                      className="btn font-normal"
                      onClick={async () => {
                        await updateProfilePicture(identity.identity_data.avatar_url);
                        closeModal();
                      }}
                    >
                      Set as pfp!
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end items-center gap-5">
              <button className="btn font-normal"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const { error } = await supabase
                        .from("users")
                        .update({ profile_picture: URL.createObjectURL(file) })
                        .eq("id", user.id);
                      if (error) {
                        console.error("error on uploading file", error);
                      } else {
                        setProfilePicture(URL.createObjectURL(file));
                      }
                    }
                  };
                  input.click();
                }}
              >
                Or upload your own! NOT FUNCTIONAL
              </button>
              <button onClick={closeModal} className="btn font-normal">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Avatar;