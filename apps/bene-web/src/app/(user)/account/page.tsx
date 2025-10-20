import { PageContainer } from "@/components";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  console.log({ data, error });
  // if (error || !data?.user) {    redirect('/login')  }
  return (
    <PageContainer title={data?.user !== null ? data.user.email : "asdf"}>
      <div className="bg-secondary p-6 rounded-lg shadow-md max-w-3xl">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-foreground mb-2">First Name</label>
              <input
                type="text"
                className="w-full p-2 rounded border border-muted bg-background"
                defaultValue={data.user?.user_metadata?.first_name || ""}
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">Last Name</label>
              <input
                type="text"
                className="w-full p-2 rounded border border-muted bg-background"
                defaultValue={data.user?.user_metadata?.last_name || ""}
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 rounded border border-muted bg-background"
                defaultValue={data.user?.email || ""}
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">Phone</label>
              <input
                type="tel"
                className="w-full p-2 rounded border border-muted bg-background"
                defaultValue={data.user?.user_metadata?.phone || ""}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-foreground mb-2">
                Current Password
              </label>
              <input
                type="password"
                className="w-full p-2 rounded border border-muted bg-background"
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">New Password</label>
              <input
                type="password"
                className="w-full p-2 rounded border border-muted bg-background"
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full p-2 rounded border border-muted bg-background"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </PageContainer>
  );
}
