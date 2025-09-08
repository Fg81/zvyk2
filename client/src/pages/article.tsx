import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: [`/api/articles/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Article not found");
        }
        throw new Error("Failed to fetch article");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  useEffect(() => {
    // Track pageview
    fetch("/api/stats/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview" }),
    }).catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Статья не найдена
            </h1>
            <p className="text-muted-foreground mb-8">
              Возможно, статья была удалена или адрес указан неверно
            </p>
            <Link href="/articles">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться к статьям
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/articles">
          <Button variant="ghost" className="mb-8 hover:bg-accent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к статьям
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-sm text-muted-foreground ml-4">
              {new Date(article.createdAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-8">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg border border-border"
            />
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      <Footer />
    </div>
  );
}