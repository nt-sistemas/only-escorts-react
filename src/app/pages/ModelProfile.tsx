import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MapPin, Phone, Mail, Star, Shield, Clock, Heart, Share2, MessageCircle, Video } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { WatermarkedImage } from "../components/ui/watermarked-image";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { getAuthSession } from "../auth/session";
import { createModelTestimonial, getModelProfileById, type ProfileModelData } from "../services/modelProfile";

export function ModelProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState<ProfileModelData | null>(null);
  const [selectedMainImage, setSelectedMainImage] = useState("");
  const [profileNotice, setProfileNotice] = useState<string | null>(null);
  const session = getAuthSession();
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialEmail, setTestimonialEmail] = useState(session?.email ?? "");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);
  const [testimonialNotice, setTestimonialNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const apiProfile = await getModelProfileById(id);
        if (cancelled) {
          return;
        }

        if (!apiProfile.id || !apiProfile.name || !apiProfile.image) {
          setModel(null);
          setSelectedMainImage("");
          setProfileNotice("Model data is incomplete.");
          return;
        }

        const nextModel: ProfileModelData = {
          id: apiProfile.id,
          name: apiProfile.name,
          image: apiProfile.image,
          verified: Boolean(apiProfile.verified),
          rating: typeof apiProfile.rating === "number" ? apiProfile.rating : 0,
          reviews: typeof apiProfile.reviews === "number" ? apiProfile.reviews : 0,
          services: Array.isArray(apiProfile.services) ? apiProfile.services : [],
          languages: Array.isArray(apiProfile.languages)
            ? apiProfile.languages
            : [],
          gallery: Array.isArray(apiProfile.gallery) ? apiProfile.gallery : [],
          videos: Array.isArray(apiProfile.videos) ? apiProfile.videos : [],
          testimonials: Array.isArray(apiProfile.testimonials)
            ? apiProfile.testimonials
            : [],
          ...(typeof apiProfile.age === "number" ? { age: apiProfile.age } : {}),
          ...(apiProfile.city ? { city: apiProfile.city } : {}),
          ...(apiProfile.category ? { category: apiProfile.category } : {}),
          ...(apiProfile.gender ? { gender: apiProfile.gender } : {}),
          ...(apiProfile.price ? { price: apiProfile.price } : {}),
          ...(apiProfile.phone ? { phone: apiProfile.phone } : {}),
          ...(apiProfile.email ? { email: apiProfile.email } : {}),
          ...(apiProfile.description ? { description: apiProfile.description } : {}),
          ...(apiProfile.availability
            ? { availability: apiProfile.availability }
            : {}),
        };

        setModel(nextModel);
        setSelectedMainImage(apiProfile.image);
        setProfileNotice(null);
      } catch {
        if (!cancelled) {
          setModel(null);
          setSelectedMainImage("");
          setProfileNotice("Could not load profile from API.");
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleCreateTestimonial = async () => {
    if (!id) {
      return;
    }

    if (!newComment.trim()) {
      setTestimonialNotice("Write your testimonial before submitting.");
      return;
    }

    if (!testimonialName.trim()) {
      setTestimonialNotice("Fill in your name before submitting.");
      return;
    }

    if (!testimonialEmail.trim()) {
      setTestimonialNotice("Fill in your email before submitting.");
      return;
    }

    const isValidEmail = /.+@.+\..+/.test(testimonialEmail.trim());
    if (!isValidEmail) {
      setTestimonialNotice("Enter a valid email address.");
      return;
    }

    setIsSubmittingTestimonial(true);
    setTestimonialNotice(null);

    try {
      const created = await createModelTestimonial(id, {
        comment: newComment.trim(),
        rating: newRating,
        author: testimonialName.trim(),
        email: testimonialEmail.trim(),
      });

      setModel((prev) => {
        if (!prev) {
          return prev;
        }

        const nextTestimonials = [created, ...prev.testimonials];
        const nextReviews = nextTestimonials.length;
        const nextRating =
          nextTestimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) /
          nextReviews;

        return {
          ...prev,
          testimonials: nextTestimonials,
          reviews: nextReviews,
          rating: Number(nextRating.toFixed(1)),
        };
      });

      setNewComment("");
      setNewRating(5);
      setTestimonialNotice("Testimonial submitted successfully.");
    } catch {
      setTestimonialNotice("Could not submit testimonial. Please try again.");
    } finally {
      setIsSubmittingTestimonial(false);
    }
  };

  if (!model) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Button>

        {profileNotice && (
          <p className="mb-6 text-sm text-neutral-400">{profileNotice}</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6 text-muted-foreground hover:text-foreground"
      >
        ← Back
      </Button>

      {profileNotice && (
        <p className="mb-6 text-sm text-neutral-400">{profileNotice}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image */}
          {selectedMainImage && (
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <WatermarkedImage
                src={selectedMainImage}
                alt={model.name}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              {model.verified && (
                <Badge className="font-highlight absolute top-4 left-4 border-0 bg-primary text-primary-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>
          )}

          {/* Gallery */}
          <div className="grid grid-cols-3 gap-4">
            {model.gallery.map((img, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <WatermarkedImage
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition cursor-pointer"
                  containerClassName="w-full h-full"
                  onClick={() => setSelectedMainImage(img)}
                />
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="bg-neutral-900 border border-neutral-800">
              <TabsTrigger value="about" className="data-[state=active]:bg-pink-500">
                About
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-pink-500">
                Services
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-pink-500">
                Videos
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-pink-500">
                Reviews ({model.reviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">About Me</h3>
                  {model.description && (
                    <p className="text-neutral-300 leading-relaxed mb-6">
                      {model.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {model.availability && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Availability</h4>
                        <div className="flex items-center text-neutral-300">
                          <Clock className="w-4 h-4 mr-2 text-pink-500" />
                          {model.availability}
                        </div>
                      </div>
                    )}

                    {model.languages.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {model.languages.map((lang) => (
                            <Badge
                              key={lang}
                              variant="outline"
                              className="border-neutral-700 text-neutral-300"
                            >
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Offered Services
                  </h3>
                  {model.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {model.services.map((service) => (
                        <div
                          key={service}
                          className="flex items-center bg-neutral-800 rounded-lg p-3"
                        >
                          <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                          <span className="text-neutral-300">{service}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-neutral-800 bg-neutral-800 p-4 text-sm text-neutral-400">
                      No services available for this profile.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <Video className="h-4 w-4 text-pink-500" />
                    Videos
                  </h3>

                  {model.videos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {model.videos.map((videoUrl, index) => (
                        <div key={`${videoUrl}-${index}`} className="overflow-hidden rounded-lg border border-neutral-800 bg-black">
                          <video
                            src={videoUrl}
                            controls
                            preload="metadata"
                            className="h-56 w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-neutral-800 bg-neutral-800 p-4 text-sm text-neutral-400">
                      No videos available for this profile.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-4">Reviews</h3>

                  <div className="mb-6 rounded-lg border border-neutral-800 bg-neutral-850 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-white">Leave a testimonial</h4>

                    <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <Input
                        value={testimonialName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTestimonialName(e.target.value)
                        }
                        placeholder="Your name"
                        className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                      />
                      <Input
                        type="email"
                        value={testimonialEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTestimonialEmail(e.target.value)
                        }
                        placeholder="your@email.com"
                        className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                      />
                    </div>

                    <div className="mb-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const starValue = index + 1;
                        const active = starValue <= newRating;

                        return (
                          <button
                            key={starValue}
                            type="button"
                            onClick={() => setNewRating(starValue)}
                            className="rounded p-1"
                            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                active ? "fill-yellow-500 text-yellow-500" : "text-neutral-600"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <Textarea
                      value={newComment}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNewComment(e.target.value)
                      }
                      placeholder="Share your experience..."
                      className="mb-3 border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
                    />

                    <Button
                      type="button"
                      onClick={handleCreateTestimonial}
                      disabled={isSubmittingTestimonial}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      {isSubmittingTestimonial ? "Submitting..." : "Submit testimonial"}
                    </Button>

                    {testimonialNotice && (
                      <p className="mt-2 text-xs text-neutral-400">{testimonialNotice}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {model.testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-neutral-800 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-pink-500 text-white">
                                {testimonial.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-semibold">
                                {testimonial.author}
                              </p>
                              <p className="text-neutral-400 text-sm">
                                {testimonial.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-500 text-yellow-500"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-neutral-300">{testimonial.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Info & Actions */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {model.name}
                    {typeof model.age === "number" ? `, ${model.age}` : ""}
                  </h1>
                  {model.city && (
                    <div className="flex items-center text-neutral-400 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {model.city}
                    </div>
                  )}
                  {model.reviews > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
                        <span className="text-white font-semibold">{model.rating}</span>
                      </div>
                      <span className="text-neutral-400">({model.reviews} reviews)</span>
                    </div>
                  )}
                </div>
                {model.category && (
                  <Badge className="font-highlight border-0 bg-primary text-primary-foreground">
                    {model.category}
                  </Badge>
                )}
              </div>

              {model.price && (
                <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                  <p className="font-highlight text-3xl font-bold text-pink-500 text-center tracking-tight">
                    {model.price}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button className="font-highlight w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                {model.phone && (
                  <Button
                    variant="outline"
                    className="font-highlight w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    View Phone Number
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          {(model.phone || model.email) && (
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {model.phone && (
                    <div className="flex items-center text-neutral-300">
                      <Phone className="w-4 h-4 mr-3 text-pink-500" />
                      {model.phone}
                    </div>
                  )}
                  {model.email && (
                    <div className="flex items-center text-neutral-300">
                      <Mail className="w-4 h-4 mr-3 text-pink-500" />
                      {model.email}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Safety Tips */}
          <Card className="bg-neutral-900 border-neutral-800">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 mr-2 text-pink-500" />
                <h3 className="text-white font-semibold">Safety Tips</h3>
              </div>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li>• Always meet in a public place first</li>
                <li>• Do not share sensitive personal information</li>
                <li>• Confirm identity before meeting</li>
                <li>• Report any suspicious behavior</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
