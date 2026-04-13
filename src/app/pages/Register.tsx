import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import { Checkbox } from "../components/ui/checkbox";
import { setAuthSession } from "../auth/session";
import { registerWithApi } from "../services/auth.js";
import { listPublicPlans, type PublicPlan } from "../services/plans.js";

export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlanId = searchParams.get("planId") || "";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPlans = async () => {
      setIsLoadingPlans(true);
      try {
        const apiPlans = await listPublicPlans();
        if (!cancelled) {
          setPlans(apiPlans);
        }
      } catch {
        if (!cancelled) {
          setPlans([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPlans(false);
        }
      }
    };

    fetchPlans();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setRegisterError(null);

    try {
      const result = await registerWithApi({
        ...(formData.name.trim() ? { name: formData.name.trim() } : {}),
        email: formData.email,
        password: formData.password,
        ...(selectedPlanId ? { planId: selectedPlanId } : {}),
      });

      setAuthSession({ role: "user", email: result.email });
      navigate("/edit-profile");
    } catch {
      setRegisterError("Could not create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="mb-2 font-display text-4xl text-primary">
            Only Escorts Intim
          </h1>
          <p className="text-muted-foreground">Sign up as a Companion</p>
        </div>

        {/* Register Card */}
        <Card className="border-border bg-card shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle className="font-display text-foreground">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in the details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan" className="text-foreground">
                    Plan
                  </Label>
                  <Select
                    value={selectedPlanId || "none"}
                    onValueChange={(value) =>
                      setSelectedPlanId(value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger className="border-border bg-input-background text-foreground">
                      <SelectValue
                        placeholder={
                          isLoadingPlans ? "Loading plans..." : "Select a plan"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-popover text-popover-foreground">
                      <SelectItem value="none">No plan</SelectItem>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                      {selectedPlanId &&
                        !plans.some((plan) => plan.id === selectedPlanId) && (
                          <SelectItem value={selectedPlanId}>
                            Selected ({selectedPlanId})
                          </SelectItem>
                        )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="border-border bg-input-background text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, terms: checked as boolean })
                  }
                  className="border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the{" "}
                  <a href="#" className="text-primary hover:text-primary/80">
                    terms of use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:text-primary/80">
                    privacy policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                className="font-highlight w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!formData.terms || isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>

              {registerError && (
                <p className="text-sm text-red-400">{registerError}</p>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-highlight text-primary hover:text-primary/80"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
