import { useEffect, useState } from "react";
import {
  Upload,
  X,
  Plus,
  Save,
  Play,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Clock,
  Eye,
  EyeOff,
  Camera,
  FileImage,
  Trash2,
  AlertTriangle,
  Star,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { StoriesViewer } from "../components/stories";
import type { StorySlide } from "../components/stories";
import { WatermarkedImage } from "../components/ui/watermarked-image";
import { listCategoryOptions, listGenderOptions } from "../services/lookups.js";
import {
  uploadProfileImages,
  uploadProfileStories,
  uploadProfileVideos,
  uploadVerificationFiles,
} from "../services/upload.js";

const DEFAULT_GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Trans"];
const DEFAULT_CATEGORY_OPTIONS = ["VIP", "Premium", "Standard"];

export function EditProfile() {
  const [testimonials, setTestimonials] = useState<
    Array<{
      id: string;
      content: string;
      stars: number;
      isVisible: boolean;
      commenterName?: string;
      commenterEmail?: string;
      isAbusive: boolean;
      deletedAt?: string;
      createdAt: string;
    }>
  >([
    {
      id: "t-1",
      content: "Very professional and attentive. Highly recommended.",
      stars: 5,
      isVisible: true,
      commenterName: "Carlos M.",
      commenterEmail: "carlos@example.com",
      isAbusive: false,
      createdAt: "2026-02-15T10:00:00.000Z",
    },
    {
      id: "t-2",
      content: "Great communication and punctual service.",
      stars: 4,
      isVisible: false,
      commenterName: "Andre S.",
      commenterEmail: "andre@example.com",
      isAbusive: false,
      createdAt: "2026-02-10T12:00:00.000Z",
    },
  ]);

  const [profileData, setProfileData] = useState({
    name: "Isabela Santos",
    email: "isabela@example.com",
    phone: "(11) 99999-9999",
    city: "São Paulo",
    age: "25",
    gender: "Female",
    category: "VIP",
    price: "500",
    description: "Hi! I'm Isabela, an experienced luxury companion...",
    availability: "Monday to Saturday, 2 PM to 11 PM",
  });

  const [services, setServices] = useState([
    "Dinners",
    "Social events",
    "Travel",
    "Companionship",
    "Massages",
  ]);

  const [newService, setNewService] = useState("");

  const [gallery, setGallery] = useState([
    "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mjk0MDk5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1638717366457-dbcaf6b1afbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBtb2RlbHxlbnwxfHx8fDE3NzI5ODU3NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1633443362894-227325b61ddf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFtb3JvdXMlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjkwODYzMnww&ixlib=rb-4.1.0&q=80&w=1080",
  ]);

  const [videos, setVideos] = useState([
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  ]);

  const [verificationPreviews, setVerificationPreviews] = useState<{
    document: string;
    selfieWithDocument: string;
  }>({
    document: "",
    selfieWithDocument: "",
  });

  // Stories state
  const [storySlides, setStorySlides] = useState<StorySlide[]>([
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mjk0MDk5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      duration: 5000,
    },
  ]);
  const [newSlideUrl, setNewSlideUrl] = useState("");
  const [newSlideDuration, setNewSlideDuration] = useState("5000");
  const [previewingStory, setPreviewingStory] = useState(false);
  const [nextSlideId, setNextSlideId] = useState(2);
  const [genderOptions, setGenderOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      const [genders, categories] = await Promise.all([
        listGenderOptions(),
        listCategoryOptions(),
      ]);

      if (cancelled) {
        return;
      }

      setGenderOptions(genders.length > 0 ? genders : DEFAULT_GENDER_OPTIONS);
      setCategoryOptions(
        categories.length > 0 ? categories : DEFAULT_CATEGORY_OPTIONS,
      );
    };

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  const addService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const removePhoto = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const uploadGalleryFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadNotice(null);

    try {
      const urls = await uploadProfileImages(Array.from(fileList));
      if (urls.length > 0) {
        setGallery((prev) => [...prev, ...urls]);
      }
      setUploadNotice(`${urls.length} image(s) uploaded successfully.`);
    } catch {
      setUploadNotice(
        "Could not upload images. Make sure you are authenticated.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const addVideo = async (file: File | null) => {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setUploadNotice(null);

    try {
      const urls = await uploadProfileVideos([file]);
      if (urls.length > 0) {
        setVideos((prev) => [...prev, ...urls]);
      }
      setUploadNotice(`${urls.length} video(s) uploaded successfully.`);
    } catch {
      setUploadNotice(
        "Could not upload video. Make sure you are authenticated.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // Story helpers
  const addStorySlide = () => {
    if (!newSlideUrl.trim()) return;
    const slide: StorySlide = {
      id: String(nextSlideId),
      image: newSlideUrl.trim(),
      duration: Number(newSlideDuration),
    };
    setStorySlides((prev) => [...prev, slide]);
    setNextSlideId((n) => n + 1);
    setNewSlideUrl("");
  };

  const uploadStoryFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadNotice(null);

    try {
      const urls = await uploadProfileStories(Array.from(fileList));

      if (urls.length > 0) {
        setStorySlides((prev) => {
          const startingId = nextSlideId;
          const uploadedSlides = urls.map((url, index) => ({
            id: String(startingId + index),
            image: url,
            duration: 5000,
          }));

          return [...prev, ...uploadedSlides];
        });

        setNextSlideId((current) => current + urls.length);
      }

      setUploadNotice(`${urls.length} story file(s) uploaded successfully.`);
    } catch {
      setUploadNotice(
        "Could not upload stories. Make sure you are authenticated.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeStorySlide = (id: StorySlide["id"]) => {
    setStorySlides((prev) => prev.filter((s) => s.id !== id));
  };

  const moveSlide = (index: number, dir: "left" | "right") => {
    const target = dir === "left" ? index - 1 : index + 1;
    if (target < 0 || target >= storySlides.length) return;
    const next = [...storySlides];
    [next[index], next[target]] = [next[target], next[index]];
    setStorySlides(next);
  };

  const updateSlideDuration = (id: StorySlide["id"], duration: number) => {
    setStorySlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, duration } : s)),
    );
  };

  const handleVerificationFileChange = async (
    key: "document" | "selfieWithDocument",
    file: File | null,
  ) => {
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setVerificationPreviews((prev) => ({
      ...prev,
      [key]: previewUrl,
    }));

    setIsUploading(true);
    setUploadNotice(null);

    try {
      const payload =
        key === "document" ? { document: file } : { selfieWithDocument: file };

      const uploaded = await uploadVerificationFiles(payload);
      const uploadedUrl =
        key === "document"
          ? uploaded.documentUrl
          : uploaded.selfieWithDocumentUrl;

      if (uploadedUrl) {
        setVerificationPreviews((prev) => ({
          ...prev,
          [key]: uploadedUrl,
        }));
      }

      setUploadNotice("Verification file uploaded successfully.");
    } catch {
      setUploadNotice(
        "Could not upload verification file. Make sure you are authenticated.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const clearVerificationFile = (key: "document" | "selfieWithDocument") => {
    const currentPreview = verificationPreviews[key];
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    setVerificationFiles((prev) => ({ ...prev, [key]: null }));
    setVerificationPreviews((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleTestimonialVisibility = (testimonialId: string) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === testimonialId
          ? { ...testimonial, isVisible: !testimonial.isVisible }
          : testimonial,
      ),
    );
  };

  const reportTestimonialAbuse = (testimonialId: string) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === testimonialId
          ? { ...testimonial, isAbusive: true, isVisible: false }
          : testimonial,
      ),
    );
  };

  const deleteTestimonial = (testimonialId: string) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === testimonialId
          ? { ...testimonial, deletedAt: new Date().toISOString() }
          : testimonial,
      ),
    );
  };

  const activeTestimonials = testimonials.filter(
    (testimonial) => !testimonial.deletedAt,
  );
  const hiddenTestimonialsCount = activeTestimonials.filter(
    (testimonial) => !testimonial.isVisible,
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-foreground">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 font-display text-3xl text-foreground">
              Edit Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your information and photo gallery
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="font-highlight bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {uploadNotice && (
          <div className="mb-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            {uploadNotice}
          </div>
        )}

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-6 border border-border bg-card">
            <TabsTrigger
              value="info"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Information
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="verification"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Verification
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="mr-2">Testimonials</span>
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-pink-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {hiddenTestimonialsCount}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="stories"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Stories
            </TabsTrigger>
          </TabsList>

          {/* Information */}
          <TabsContent value="info">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-display text-foreground">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Update your profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="border-border bg-input-background text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="border-border bg-input-background text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="border-border bg-input-background text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) =>
                        setProfileData({ ...profileData, city: e.target.value })
                      }
                      className="border-border bg-input-background text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-foreground">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={profileData.age}
                      onChange={(e) =>
                        setProfileData({ ...profileData, age: e.target.value })
                      }
                      className="border-border bg-input-background text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-foreground">
                      Gender
                    </Label>
                    <Select
                      value={profileData.gender}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, gender: value })
                      }
                    >
                      <SelectTrigger className="border-border bg-input-background text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-popover text-popover-foreground">
                        {genderOptions.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                        {profileData.gender &&
                          !genderOptions.includes(profileData.gender) && (
                            <SelectItem value={profileData.gender}>
                              {profileData.gender}
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">
                      Category
                    </Label>
                    <Select
                      value={profileData.category}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, category: value })
                      }
                    >
                      <SelectTrigger className="border-border bg-input-background text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-popover text-popover-foreground">
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        {profileData.category &&
                          !categoryOptions.includes(profileData.category) && (
                            <SelectItem value={profileData.category}>
                              {profileData.category}
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="price"
                      className="font-highlight text-foreground"
                    >
                      Price per hour (€)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={profileData.price}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          price: e.target.value,
                        })
                      }
                      className="border-border bg-input-background text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-foreground">
                    Availability
                  </Label>
                  <Input
                    id="availability"
                    value={profileData.availability}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        availability: e.target.value,
                      })
                    }
                    className="border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                    placeholder="Ex: Monday to Friday, 10 AM to 8 PM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={profileData.description}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        description: e.target.value,
                      })
                    }
                    className="min-h-32 border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-display text-foreground">
                  Offered Services
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage the services you offer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addService()}
                    className="border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                    placeholder="Type a service..."
                  />
                  <Button
                    onClick={addService}
                    className="font-highlight bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-muted/40 p-3"
                    >
                      <span className="text-foreground">{service}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {services.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No services added yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery */}
          <TabsContent value="gallery">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-display text-foreground">
                  Photo Gallery
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Add or remove photos from your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="block cursor-pointer rounded-lg border-2 border-dashed border-border p-8 text-center transition hover:border-primary">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-500" />
                  <p className="text-muted-foreground mb-2">
                    Click to upload or drag your photos here
                  </p>
                  <p className="text-muted-foreground/80 text-sm">
                    PNG, JPG up to 10MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      void uploadGalleryFiles(e.target.files)
                    }
                    disabled={isUploading}
                  />
                </label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((photo, index) => (
                    <div key={index} className="relative group aspect-square">
                      <WatermarkedImage
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                        containerClassName="w-full h-full rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removePhoto(index)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                      {index === 0 && (
                        <Badge className="font-highlight absolute top-2 left-2 border-0 bg-primary text-primary-foreground">
                          Main
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {gallery.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No photos added yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Videos */}
          <TabsContent value="videos">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-display text-foreground">
                  Videos
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Add or remove videos from your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="block cursor-pointer rounded-lg border-2 border-dashed border-border p-8 text-center transition hover:border-primary">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-neutral-500" />
                  <p className="mb-2 text-muted-foreground">
                    Click to upload videos
                  </p>
                  <p className="text-sm text-muted-foreground/80">
                    MP4, WebM up to 50MB
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      void addVideo(e.target.files?.[0] || null)
                    }
                    disabled={isUploading}
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {videos.map((video, index) => (
                    <div
                      key={`${video}-${index}`}
                      className="relative overflow-hidden rounded-lg border border-border bg-black"
                    >
                      <video
                        src={video}
                        controls
                        className="h-56 w-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute right-2 top-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVideo(index)}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                      {index === 0 && (
                        <Badge className="font-highlight absolute bottom-2 left-2 border-0 bg-primary text-primary-foreground">
                          Main
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {videos.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    No videos added yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification */}
          <TabsContent value="verification">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-display text-foreground">
                  Identity Verification
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Send your verification documents. Only user and admin can
                  access this area.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 rounded-xl border border-border p-4">
                    <div>
                      <h3 className="font-medium text-foreground">
                        Document photo
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Upload your ID card, passport, or driver license.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        asChild
                      >
                        <label className="cursor-pointer">
                          <Camera className="w-4 h-4 mr-2" />
                          Use camera
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              handleVerificationFileChange(
                                "document",
                                e.target.files?.[0] || null,
                              )
                            }
                          />
                        </label>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        asChild
                      >
                        <label className="cursor-pointer">
                          <FileImage className="w-4 h-4 mr-2" />
                          Upload file
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              handleVerificationFileChange(
                                "document",
                                e.target.files?.[0] || null,
                              )
                            }
                          />
                        </label>
                      </Button>
                    </div>

                    {verificationPreviews.document && (
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <img
                          src={verificationPreviews.document}
                          alt="Document preview"
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => clearVerificationFile("document")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 rounded-xl border border-border p-4">
                    <div>
                      <h3 className="font-medium text-foreground">
                        Selfie with document
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Take a photo holding the same document near your face.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        asChild
                      >
                        <label className="cursor-pointer">
                          <Camera className="w-4 h-4 mr-2" />
                          Use camera
                          <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            className="hidden"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              handleVerificationFileChange(
                                "selfieWithDocument",
                                e.target.files?.[0] || null,
                              )
                            }
                          />
                        </label>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        asChild
                      >
                        <label className="cursor-pointer">
                          <FileImage className="w-4 h-4 mr-2" />
                          Upload file
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              handleVerificationFileChange(
                                "selfieWithDocument",
                                e.target.files?.[0] || null,
                              )
                            }
                          />
                        </label>
                      </Button>
                    </div>

                    {verificationPreviews.selfieWithDocument && (
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <img
                          src={verificationPreviews.selfieWithDocument}
                          alt="Selfie with document preview"
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            clearVerificationFile("selfieWithDocument")
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
                  After selecting both images, click Save Changes to continue
                  the verification process.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials */}
          <TabsContent value="testimonials">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-display text-foreground">
                  Testimonials Management
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Control visibility, report abusive reviews, or delete
                  testimonials. Name, rating, and text are read-only.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeTestimonials.length > 0 ? (
                  activeTestimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {testimonial.commenterName || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.commenterEmail || "No email"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(testimonial.createdAt).toLocaleDateString(
                              "en-GB",
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: testimonial.stars }).map(
                            (_, index) => (
                              <Star
                                key={index}
                                className="h-4 w-4 fill-yellow-500 text-yellow-500"
                              />
                            ),
                          )}
                        </div>
                      </div>

                      <p className="mb-3 text-sm text-foreground">
                        {testimonial.content}
                      </p>

                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge
                          variant={
                            testimonial.isVisible ? "default" : "outline"
                          }
                        >
                          {testimonial.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                        {testimonial.isAbusive && (
                          <Badge variant="destructive">Abusive reported</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            toggleTestimonialVisibility(testimonial.id)
                          }
                          className="border-border"
                        >
                          {testimonial.isVisible ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Show
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => reportTestimonialAbuse(testimonial.id)}
                          disabled={testimonial.isAbusive}
                          className="border-orange-600/30 text-orange-500 hover:bg-orange-500/10"
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Report abuse
                        </Button>

                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => deleteTestimonial(testimonial.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-border bg-muted/30 p-8 text-center text-muted-foreground">
                    No testimonials available.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stories */}
          <TabsContent value="stories">
            <div className="space-y-6">
              {/* Header card */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-display text-foreground">
                        My Stories
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Add slides to your story — they appear at the top of the
                        home page
                      </CardDescription>
                    </div>
                    {storySlides.length > 0 && (
                      <Button
                        onClick={() => setPreviewingStory(true)}
                        variant="outline"
                        className="font-highlight gap-2 border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Slides list */}
                  {storySlides.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2">
                      {storySlides.map((slide, index) => (
                        <div
                          key={slide.id}
                          className="flex-shrink-0 w-36 space-y-2"
                        >
                          {/* Thumbnail */}
                          <div className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-muted/40">
                            <WatermarkedImage
                              src={slide.image}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-full object-cover"
                              containerClassName="w-full h-full"
                            />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="bg-red-500 hover:bg-red-600 text-xs"
                                onClick={() => removeStorySlide(slide.id)}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>

                            {/* Slide number badge */}
                            <Badge className="absolute top-2 left-2 bg-black/60 text-white border-0 text-xs">
                              {index + 1}
                            </Badge>
                          </div>

                          {/* Duration selector */}
                          <Select
                            value={String(slide.duration ?? 5000)}
                            onValueChange={(v) =>
                              updateSlideDuration(slide.id, Number(v))
                            }
                          >
                            <SelectTrigger className="h-8 border-border bg-input-background text-foreground text-xs">
                              <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-border bg-popover text-popover-foreground">
                              <SelectItem value="3000">3 seconds</SelectItem>
                              <SelectItem value="5000">5 seconds</SelectItem>
                              <SelectItem value="7000">7 seconds</SelectItem>
                              <SelectItem value="10000">10 seconds</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Reorder buttons */}
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 h-7 px-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              onClick={() => moveSlide(index, "left")}
                              disabled={index === 0}
                              aria-label="Move left"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 h-7 px-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              onClick={() => moveSlide(index, "right")}
                              disabled={index === storySlides.length - 1}
                              aria-label="Move right"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <Play className="w-10 h-10 mb-3 opacity-40" />
                      <p className="text-sm">
                        No slides yet. Add your first one below.
                      </p>
                    </div>
                  )}

                  {/* Add new slide */}
                  <div className="space-y-4 rounded-xl border border-border p-5">
                    <h3 className="flex items-center gap-2 font-display text-foreground">
                      <ImagePlus className="w-4 h-4 text-pink-400" />
                      Add new slide
                    </h3>

                    {/* Upload area */}
                    <label className="block cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center transition hover:border-primary">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-neutral-500" />
                      <p className="text-muted-foreground text-sm mb-1">
                        Click to upload or drag an image here
                      </p>
                      <p className="text-muted-foreground/80 text-xs">
                        PNG, JPG up to 10MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          void uploadStoryFiles(e.target.files)
                        }
                        disabled={isUploading}
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        or paste a URL
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1 space-y-1">
                        <Label className="text-muted-foreground text-xs">
                          Image URL
                        </Label>
                        <Input
                          value={newSlideUrl}
                          onChange={(e) => setNewSlideUrl(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && addStorySlide()
                          }
                          className="border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="w-36 space-y-1">
                        <Label className="text-muted-foreground text-xs">
                          Duration
                        </Label>
                        <Select
                          value={newSlideDuration}
                          onValueChange={setNewSlideDuration}
                        >
                          <SelectTrigger className="border-border bg-input-background text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-border bg-popover text-popover-foreground">
                            <SelectItem value="3000">3 seconds</SelectItem>
                            <SelectItem value="5000">5 seconds</SelectItem>
                            <SelectItem value="7000">7 seconds</SelectItem>
                            <SelectItem value="10000">10 seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* URL preview */}
                    {newSlideUrl && (
                      <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
                        <div className="w-14 aspect-[9/16] rounded overflow-hidden flex-shrink-0 bg-muted">
                          <WatermarkedImage
                            src={newSlideUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            containerClassName="w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground truncate">
                            {newSlideUrl}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground/80">
                            Duration: {Number(newSlideDuration) / 1000}s
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={addStorySlide}
                      disabled={!newSlideUrl.trim()}
                      className="font-highlight w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Slide
                    </Button>
                  </div>

                  {/* Tip */}
                  <p className="text-center text-xs text-muted-foreground">
                    Stories appear for 24 hours. Use vertical images (9:16) for
                    best results.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Story preview modal */}
            {previewingStory && storySlides.length > 0 && (
              <StoriesViewer
                stories={[
                  {
                    id: "0",
                    userId: "0",
                    userName: profileData.name,
                    userImage: gallery[0] ?? "",
                    slides: storySlides,
                    viewed: false,
                  },
                ]}
                initialIndex={0}
                onClose={() => setPreviewingStory(false)}
                onStoryViewed={() => {}}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
