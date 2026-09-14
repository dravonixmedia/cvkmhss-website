import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <p className="font-heading text-8xl font-bold text-navy">404</p>
        <h1 className="font-heading mt-4 text-2xl font-bold text-navy">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate">
          The page you are looking for could not be found. It may have been moved or no longer
          exists.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary">
            Back to Home
          </Button>
          <Button href="/contact" variant="secondary">
            Contact School
          </Button>
        </div>
      </Container>
    </section>
  );
}
