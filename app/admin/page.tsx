"use client";

import MaintenanceToggle from "@/components/admin/MaintenanceToggle";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileUp,
  ImagePlus,
  Loader2,
  Lock,
  LogOut,
  Plus,
  RefreshCcw,
  Trash2,
  Video,
} from "lucide-react";

type UploadType = "gallery" | "reel" | "download";

type AdminItem = {
  id: string;
  title: string;
  tag: string;
  description: string;
  mediaUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  fileName: string;
  fileType: string;
  status: string;
  createdAt: string;
};

async function readJsonResponse(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "API returned HTML error. Check VS Code terminal for the real error."
    );
  }
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");

  const [type, setType] = useState<UploadType>("gallery");
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function loadItems(selectedType = type) {
    setItemsLoading(true);

    try {
      const response = await fetch(`/api/admin/items?type=${selectedType}`, {
        cache: "no-store",
      });

      const data = await readJsonResponse(response);

      if (response.status === 401) {
        setLoggedIn(false);
        setItems([]);
        return;
      }

      setLoggedIn(true);
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setLoggedIn(false);
      setItems([]);
    } finally {
      setItemsLoading(false);
    }
  }

  useEffect(() => {
    loadItems("gallery");
  }, []);

  useEffect(() => {
    if (loggedIn) {
      loadItems(type);
    }
  }, [type, loggedIn]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await readJsonResponse(response);

      setSuccess(Boolean(data.success));
      setMessage(data.message || "Login completed");

      if (data.success) {
        setPassword("");
        setLoggedIn(true);
        await loadItems(type);
      }
    } catch (error) {
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", {
      method: "DELETE",
    });

    setLoggedIn(false);
    setItems([]);
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const formData = new FormData();

      formData.append("type", type);
      formData.append("title", title);
      formData.append("tag", tag);
      formData.append("description", description);
      formData.append("videoUrl", videoUrl);

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await readJsonResponse(response);

      setSuccess(Boolean(data.success));
      setMessage(data.message || "Request completed");

      if (response.status === 401) {
        setLoggedIn(false);
        return;
      }

      if (!response.ok) {
        setSuccess(false);
        return;
      }

      if (data.success) {
        setTitle("");
        setTag("");
        setDescription("");
        setVideoUrl("");
        setFile(null);

        const input = document.getElementById(
          "admin-file"
        ) as HTMLInputElement | null;

        if (input) input.value = "";

        await loadItems(type);
      }
    } catch (error) {
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string) {
    const confirmDelete = window.confirm("Delete this item permanently?");

    if (!confirmDelete) return;

    setItemsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/items?type=${type}&id=${id}`, {
        method: "DELETE",
      });

      const data = await readJsonResponse(response);

      setSuccess(Boolean(data.success));
      setMessage(data.message || "Delete completed");

      if (response.status === 401) {
        setLoggedIn(false);
        return;
      }

      await loadItems(type);
    } catch (error) {
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setItemsLoading(false);
    }
  }

  if (loggedIn === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] text-[#111111]">
        <Loader2 className="h-8 w-8 animate-spin text-[#e81818]" />
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-[#f6f3ee] px-5 py-8 text-[#111111] md:px-14">
        <section className="mx-auto max-w-xl">
          <Link
            href="/"
            className="mb-8 flex w-fit items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-3 text-sm font-black shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff]"
          >
            <ArrowLeft className="h-5 w-5 text-[#e81818]" />
            Home
          </Link>

          <div className="rounded-[42px] bg-[#f6f3ee] p-7 shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6f3ee] text-[#e81818] shadow-[inset_5px_5px_10px_#d8d3cc,inset_-5px_-5px_10px_#ffffff]">
              <Lock className="h-7 w-7" />
            </div>

            <h1 className="text-4xl font-black tracking-[-0.04em]">
              Admin Login
            </h1>

            <p className="mt-3 text-sm font-bold leading-7 text-[#666]">
              Login once. After login, uploads and deletes work without typing
              the password again.
            </p>

            <form onSubmit={handleLogin} className="mt-7 space-y-5">
              <InputField
                label="Admin Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter admin password"
              />

              {message && <MessageBox success={success} message={message} />}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#e81818] px-7 py-5 text-base font-black text-white shadow-[8px_8px_18px_#d5b8b8,-8px_-8px_18px_#ffffff] disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Lock className="h-5 w-5" />
                )}
                Login
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const uploadLabel =
    type === "gallery"
      ? "Upload Photo"
      : type === "reel"
        ? "Upload Reel Thumbnail"
        : "Upload File / PDF / Schedule";

  const acceptType =
    type === "download"
      ? ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,image/*,application/pdf"
      : "image/*";

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-5 py-8 text-[#111111] md:px-14">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-3 text-sm font-black shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff]"
          >
            <ArrowLeft className="h-5 w-5 text-[#e81818]" />
            Home
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-full bg-[#111111] px-5 py-3 text-sm font-black text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="rounded-[42px] bg-[#f6f3ee] p-7 shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
          <h1 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">
            Admin Panel
          </h1>
<p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[#666] md:text-base">
  Add gallery photos, reel links with thumbnails, and official
  downloads. You can view and delete uploaded items below.
</p>

<div className="mt-8">
  <MaintenanceToggle />
</div>

<div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <TypeButton
              active={type === "gallery"}
              onClick={() => setType("gallery")}
              icon={<ImagePlus />}
              title="Gallery Photo"
              text="Upload image"
              color="bg-[#2aa1b3]"
            />

            <TypeButton
              active={type === "reel"}
              onClick={() => setType("reel")}
              icon={<Video />}
              title="Reel Link"
              text="Link + thumbnail"
              color="bg-[#b41f6c]"
            />

            <TypeButton
              active={type === "download"}
              onClick={() => setType("download")}
              icon={<FileUp />}
              title="Downloads"
              text="PDF / files"
              color="bg-[#bf7d2a]"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label="Title"
                value={title}
                onChange={setTitle}
                placeholder={
                  type === "gallery"
                    ? "Opening Snap"
                    : type === "reel"
                      ? "Instagram Reel"
                      : "Programme Schedule"
                }
              />

              <InputField
                label={type === "download" ? "File Type" : "Tag"}
                value={tag}
                onChange={setTag}
                placeholder={
                  type === "download"
                    ? "PDF / RULES / MAP"
                    : type === "gallery"
                      ? "Stage"
                      : "Highlight"
                }
              />
            </div>

            {type === "reel" && (
              <InputField
                label="Reel Link"
                value={videoUrl}
                onChange={setVideoUrl}
                placeholder="Paste Instagram / YouTube / Drive reel link"
              />
            )}

            <div>
              <label className="mb-2 block text-sm font-black">
                {uploadLabel}
              </label>

              <input
                id="admin-file"
                type="file"
                accept={acceptType}
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="w-full rounded-[24px] bg-[#f6f3ee] px-5 py-4 text-sm font-bold shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff]"
              />

              {file && (
                <p className="mt-2 text-xs font-bold text-[#777]">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Small description..."
                rows={4}
                className="w-full resize-none rounded-[28px] bg-[#f6f3ee] px-5 py-4 text-sm font-bold outline-none shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff] placeholder:text-[#999]"
              />
            </div>

            {message && <MessageBox success={success} message={message} />}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-[#e81818] px-7 py-5 text-base font-black text-white shadow-[8px_8px_18px_#d5b8b8,-8px_-8px_18px_#ffffff] disabled:opacity-70 md:w-fit"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {type === "gallery"
                ? "Upload Gallery Photo"
                : type === "reel"
                  ? "Add Reel Link"
                  : "Upload Download File"}
            </button>
          </form>
        </div>

        <div className="mt-10 rounded-[42px] bg-[#f6f3ee] p-7 shadow-[14px_14px_30px_#d8d3cc,-14px_-14px_30px_#ffffff] md:p-10">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.04em]">
                Uploaded Items
              </h2>

              <p className="mt-2 text-sm font-bold text-[#777]">
                Current {type} items.
              </p>
            </div>

            <button
              onClick={() => loadItems(type)}
              className="flex w-fit items-center gap-3 rounded-full bg-[#f6f3ee] px-5 py-3 text-sm font-black shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff]"
            >
              <RefreshCcw className="h-4 w-4 text-[#e81818]" />
              Refresh
            </button>
          </div>

          {itemsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-7 w-7 animate-spin text-[#e81818]" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  type={type}
                  item={item}
                  onDelete={() => deleteItem(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] bg-[#f6f3ee] p-8 text-center shadow-[inset_8px_8px_16px_#d8d3cc,inset_-8px_-8px_16px_#ffffff]">
              <p className="text-xl font-black">No items yet</p>
              <p className="mt-2 text-sm font-bold text-[#777]">
                Upload one item from the form above.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ItemCard({
  type,
  item,
  onDelete,
}: {
  type: UploadType;
  item: AdminItem;
  onDelete: () => void;
}) {
  const previewUrl =
    type === "reel" ? item.thumbnailUrl : type === "gallery" ? item.mediaUrl : "";

  const openUrl =
    type === "reel" ? item.videoUrl || item.mediaUrl : item.mediaUrl;

  return (
    <div className="overflow-hidden rounded-[30px] bg-[#f6f3ee] p-5 shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff]">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={item.title}
          className="mb-5 aspect-[4/3] w-full rounded-[22px] object-cover"
        />
      ) : (
        <div className="mb-5 flex aspect-[4/3] w-full items-center justify-center rounded-[22px] bg-[#111111] text-white">
          <FileUp className="h-10 w-10" />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e81818]">
            {item.tag || type}
          </p>

          <h3 className="mt-1 text-2xl font-black">{item.title}</h3>

          <p className="mt-2 text-sm font-bold text-[#777]">
            {item.description || item.fileName || "No description"}
          </p>
        </div>

        <button
          onClick={onDelete}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e81818] text-white"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {openUrl && (
        <a
          href={openUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex w-fit items-center gap-2 rounded-full bg-[#f6f3ee] px-4 py-3 text-sm font-black shadow-[inset_5px_5px_10px_#d8d3cc,inset_-5px_-5px_10px_#ffffff]"
        >
          Open
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function TypeButton({
  active,
  onClick,
  icon,
  title,
  text,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[26px] px-5 py-5 text-left shadow-[8px_8px_18px_#d8d3cc,-8px_-8px_18px_#ffffff] transition active:scale-95 ${
        active ? `${color} text-white` : "bg-[#f6f3ee] text-[#111111]"
      }`}
    >
      <div className="mb-3 h-7 w-7">{icon}</div>
      <p className="font-black">{title}</p>
      <p className="mt-1 text-xs font-bold opacity-70">{text}</p>
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full bg-[#f6f3ee] px-5 py-4 text-sm font-bold outline-none shadow-[inset_6px_6px_12px_#d8d3cc,inset_-6px_-6px_12px_#ffffff] placeholder:text-[#999]"
      />
    </div>
  );
}

function MessageBox({
  success,
  message,
}: {
  success: boolean;
  message: string;
}) {
  return (
    <div
      className={`rounded-[24px] px-5 py-4 text-sm font-black ${
        success
          ? "bg-[#e7fff0] text-[#008a3d]"
          : "bg-[#fff0f0] text-[#e81818]"
      }`}
    >
      {message}
    </div>
  );
}