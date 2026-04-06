import { Link } from "react-router-dom";
import Page from "../components/common/Page";

export default function NotFoundPage() {
  return (
    <Page title="Page not found" subtitle="The page you’re looking for doesn’t exist.">
      <div className="rounded-2xl border bg-white p-8 text-center shadow-soft">
        <div className="text-5xl font-extrabold text-slate-900">404</div>
        <p className="mt-2 text-sm text-slate-600">
          Go back to home or browse products.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </Page>
  );
}
