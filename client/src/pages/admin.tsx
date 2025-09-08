import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import LoginModal from "@/components/admin/login-modal";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { apiRequest } from "@/lib/queryClient";

export default function Admin() {
  const { admin, isLoading, logout } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [articleForm, setArticleForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Установка",
    imageUrl: "",
    published: false,
  });

  const [headUnitForm, setHeadUnitForm] = useState({
    brand: "",
    model: "",
    powerOutput: 0,
    features: "",
    price: 0,
    active: true,
  });

  const [speakerForm, setSpeakerForm] = useState({
    brand: "",
    model: "",
    type: "coaxial",
    size: 0,
    powerRms: 0,
    powerMax: 0,
    impedance: 4,
    frequencyResponse: "",
    price: 0,
    active: true,
  });

  const [amplifierForm, setAmplifierForm] = useState({
    brand: "",
    model: "",
    channels: 2,
    powerRms: 0,
    powerMax: 0,
    impedance: 4,
    features: "",
    price: 0,
    active: true,
  });

  const [subwooferForm, setSubwooferForm] = useState({
    brand: "",
    model: "",
    size: 0,
    powerRms: 0,
    powerMax: 0,
    impedance: 4,
    frequencyResponse: "",
    recommendedBoxType: "sealed",
    price: 0,
    active: true,
  });

  useEffect(() => {
    // Track pageview
    fetch("/api/stats/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview" }),
    }).catch(console.error);
  }, []);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!admin,
  });

  const { data: articles = [] } = useQuery({
    queryKey: ["/api/articles"],
    enabled: !!admin,
  });

  const { data: headUnits = [] } = useQuery({
    queryKey: ["/api/audio/head-units"],
    enabled: !!admin,
  });

  const { data: speakers = [] } = useQuery({
    queryKey: ["/api/audio/speakers"],
    enabled: !!admin,
  });

  const { data: amplifiers = [] } = useQuery({
    queryKey: ["/api/audio/amplifiers"],
    enabled: !!admin,
  });

  const { data: subwoofers = [] } = useQuery({
    queryKey: ["/api/audio/subwoofers"],
    enabled: !!admin,
  });

  const createArticleMutation = useMutation({
    mutationFn: async (articleData: any) => {
      await apiRequest("POST", "/api/articles", articleData);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Статья создана успешно",
      });
      setArticleForm({
        title: "",
        excerpt: "",
        content: "",
        category: "Установка",
        imageUrl: "",
        published: false,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать статью",
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      await apiRequest("DELETE", `/api/articles/${articleId}`);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Статья удалена успешно",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить статью",
        variant: "destructive",
      });
    },
  });

  // Component mutations
  const createHeadUnitMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/audio/head-units", data);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Головное устройство добавлено",
      });
      setHeadUnitForm({
        brand: "",
        model: "",
        powerOutput: 0,
        features: "",
        price: 0,
        active: true,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audio/head-units"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить головное устройство",
        variant: "destructive",
      });
    },
  });

  const deleteHeadUnitMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/audio/head-units/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Головное устройство удалено",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audio/head-units"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить головное устройство",
        variant: "destructive",
      });
    },
  });

  const createSpeakerMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/audio/speakers", data);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Динамик добавлен",
      });
      setSpeakerForm({
        brand: "",
        model: "",
        type: "coaxial",
        size: 0,
        powerRms: 0,
        powerMax: 0,
        impedance: 4,
        frequencyResponse: "",
        price: 0,
        active: true,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audio/speakers"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить динамик",
        variant: "destructive",
      });
    },
  });

  const deleteSpeakerMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/audio/speakers/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Динамик удален",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audio/speakers"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить динамик",
        variant: "destructive",
      });
    },
  });

  const createAmplifierMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/audio/amplifiers", data);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Усилитель добавлен",
      });
      setAmplifierForm({
        brand: "",
        model: "",
        channels: 2,
        powerRms: 0,
        powerMax: 0,
        impedance: 4,
        features: "",
        price: 0,
        active: true,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audio/amplifiers"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить усилитель",
        variant: "destructive",
      });
    },
  });

  const deleteAmplifierMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/audio/amplifiers/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Усилитель удален",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audio/amplifiers"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить усилитель",
        variant: "destructive",
      });
    },
  });

  const createSubwooferMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/audio/subwoofers", data);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Сабвуфер добавлен",
      });
      setSubwooferForm({
        brand: "",
        model: "",
        size: 0,
        powerRms: 0,
        powerMax: 0,
        impedance: 4,
        frequencyResponse: "",
        recommendedBoxType: "sealed",
        price: 0,
        active: true,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audio/subwoofers"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить сабвуфер",
        variant: "destructive",
      });
    },
  });

  const deleteSubwooferMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/audio/subwoofers/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Успешно",
        description: "Сабвуфер удален",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audio/subwoofers"] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить сабвуфер",
        variant: "destructive",
      });
    },
  });

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    createArticleMutation.mutate(articleForm);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <LoginModal />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold text-primary">30HERTZ</div>
              <div className="text-sm text-muted-foreground">ADMIN</div>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            <div className="flex items-center px-4 py-3 text-card-foreground bg-primary/10 rounded-lg">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Панель управления
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-card-foreground"
              onClick={logout}
              data-testid="logout-button"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Выйти
            </Button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-card border-b border-border p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-card-foreground">Панель управления</h1>
              <div className="text-sm text-muted-foreground">
                Добро пожаловать, {(admin as any)?.email}
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card data-testid="stats-visitors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-card-foreground">
                        {(stats as any)?.visitors || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Посетители сегодня</div>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="stats-articles">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-card-foreground">
                        {(articles as any[]).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Статей опубликовано</div>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="stats-calculations">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-card-foreground">
                        {(stats as any)?.calculations || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Расчетов выполнено</div>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="stats-pageviews">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-card-foreground">
                        {(stats as any)?.pageviews || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Просмотров сегодня</div>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="articles">Статьи</TabsTrigger>
                <TabsTrigger value="head-units">Головные устройства</TabsTrigger>
                <TabsTrigger value="speakers">Динамики</TabsTrigger>
                <TabsTrigger value="amplifiers">Усилители</TabsTrigger>
                <TabsTrigger value="subwoofers">Сабвуферы</TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Создать новую статью</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleArticleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Заголовок *</Label>
                      <Input
                        id="title"
                        value={articleForm.title}
                        onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                        placeholder="Введите заголовок статьи"
                        data-testid="article-title-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="excerpt">Краткое описание</Label>
                      <Input
                        id="excerpt"
                        value={articleForm.excerpt}
                        onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                        placeholder="Краткое описание статьи"
                        data-testid="article-excerpt-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Категория</Label>
                      <Select value={articleForm.category} onValueChange={(value) => setArticleForm({...articleForm, category: value})}>
                        <SelectTrigger data-testid="article-category-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Установка">Установка</SelectItem>
                          <SelectItem value="Обзор">Обзор</SelectItem>
                          <SelectItem value="Настройка">Настройка</SelectItem>
                          <SelectItem value="Новости">Новости</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="imageUrl">URL изображения</Label>
                      <Input
                        id="imageUrl"
                        value={articleForm.imageUrl}
                        onChange={(e) => setArticleForm({...articleForm, imageUrl: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        data-testid="article-image-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Содержание *</Label>
                      <RichTextEditor
                        content={articleForm.content}
                        onChange={(content) => setArticleForm({...articleForm, content})}
                        placeholder="Введите текст статьи..."
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={articleForm.published}
                        onChange={(e) => setArticleForm({...articleForm, published: e.target.checked})}
                        className="rounded border-border"
                        data-testid="article-published-checkbox"
                      />
                      <Label htmlFor="published">Опубликовать сразу</Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full gradient-glow"
                      disabled={createArticleMutation.isPending}
                      data-testid="create-article-button"
                    >
                      {createArticleMutation.isPending ? "Создание..." : "Опубликовать статью"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Articles List */}
              <Card>
                <CardHeader>
                  <CardTitle>Управление статьями</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(articles as any[]).length > 0 ? (
                      (articles as any[]).map((article: any) => (
                        <div key={article.id} className="flex items-center justify-between py-3 border-b border-border" data-testid={`article-item-${article.id}`}>
                          <div className="flex-1">
                            <div className="font-medium text-card-foreground">{article.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {article.category} • {new Date(article.createdAt).toLocaleDateString('ru-RU')}
                              {article.published ? (
                                <span className="ml-2 text-green-600">Опубликовано</span>
                              ) : (
                                <span className="ml-2 text-yellow-600">Черновик</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteArticleMutation.mutate(article.id)}
                            disabled={deleteArticleMutation.isPending}
                            data-testid={`delete-article-${article.id}`}
                          >
                            Удалить
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Статьи не найдены</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
                </div>
              </TabsContent>

              {/* Head Units Tab */}
              <TabsContent value="head-units" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Добавить головное устройство</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createHeadUnitMutation.mutate(headUnitForm);
                      }} className="space-y-4">
                        <div>
                          <Label>Бренд</Label>
                          <Input
                            value={headUnitForm.brand}
                            onChange={(e) => setHeadUnitForm({...headUnitForm, brand: e.target.value})}
                            placeholder="Pioneer, Alpine, JVC..."
                          />
                        </div>
                        <div>
                          <Label>Модель</Label>
                          <Input
                            value={headUnitForm.model}
                            onChange={(e) => setHeadUnitForm({...headUnitForm, model: e.target.value})}
                            placeholder="DEH-X7900BT"
                          />
                        </div>
                        <div>
                          <Label>Выходная мощность (W)</Label>
                          <Input
                            type="number"
                            value={headUnitForm.powerOutput}
                            onChange={(e) => setHeadUnitForm({...headUnitForm, powerOutput: parseInt(e.target.value) || 0})}
                            placeholder="200"
                          />
                        </div>
                        <div>
                          <Label>Особенности</Label>
                          <Textarea
                            value={headUnitForm.features}
                            onChange={(e) => setHeadUnitForm({...headUnitForm, features: e.target.value})}
                            placeholder="CD/MP3/USB/Bluetooth, цветной дисплей..."
                          />
                        </div>
                        <div>
                          <Label>Цена ($)</Label>
                          <Input
                            type="number"
                            value={headUnitForm.price}
                            onChange={(e) => setHeadUnitForm({...headUnitForm, price: parseInt(e.target.value) || 0})}
                            placeholder="150"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={headUnitForm.active}
                            onCheckedChange={(checked) => setHeadUnitForm({...headUnitForm, active: checked})}
                          />
                          <Label>Активно</Label>
                        </div>
                        <Button type="submit" className="w-full gradient-glow" disabled={createHeadUnitMutation.isPending}>
                          {createHeadUnitMutation.isPending ? "Добавление..." : "Добавить устройство"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Головные устройства</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {(headUnits as any[]).length > 0 ? (
                          (headUnits as any[]).map((unit: any) => (
                            <div key={unit.id} className="flex items-center justify-between py-3 border-b border-border">
                              <div className="flex-1">
                                <div className="font-medium">{unit.brand} {unit.model}</div>
                                <div className="text-sm text-muted-foreground">
                                  {unit.powerOutput}W • ${unit.price}
                                  {unit.active ? (
                                    <span className="ml-2 text-green-600">Активно</span>
                                  ) : (
                                    <span className="ml-2 text-red-600">Неактивно</span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteHeadUnitMutation.mutate(unit.id)}
                                disabled={deleteHeadUnitMutation.isPending}
                              >
                                Удалить
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Головные устройства не найдены</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Speakers Tab */}
              <TabsContent value="speakers" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Добавить динамик</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createSpeakerMutation.mutate(speakerForm);
                      }} className="space-y-4">
                        <div>
                          <Label>Бренд</Label>
                          <Input
                            value={speakerForm.brand}
                            onChange={(e) => setSpeakerForm({...speakerForm, brand: e.target.value})}
                            placeholder="Focal, Pioneer, Alpine..."
                          />
                        </div>
                        <div>
                          <Label>Модель</Label>
                          <Input
                            value={speakerForm.model}
                            onChange={(e) => setSpeakerForm({...speakerForm, model: e.target.value})}
                            placeholder="Access 165 AS"
                          />
                        </div>
                        <div>
                          <Label>Тип</Label>
                          <Select value={speakerForm.type} onValueChange={(value) => setSpeakerForm({...speakerForm, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="coaxial">Коаксиальный</SelectItem>
                              <SelectItem value="component">Компонентный</SelectItem>
                              <SelectItem value="midrange">Среднечастотный</SelectItem>
                              <SelectItem value="tweeter">Высокочастотный</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Размер (мм)</Label>
                          <Input
                            type="number"
                            value={speakerForm.size}
                            onChange={(e) => setSpeakerForm({...speakerForm, size: parseInt(e.target.value) || 0})}
                            placeholder="165"
                          />
                        </div>
                        <div>
                          <Label>Мощность RMS (W)</Label>
                          <Input
                            type="number"
                            value={speakerForm.powerRms}
                            onChange={(e) => setSpeakerForm({...speakerForm, powerRms: parseInt(e.target.value) || 0})}
                            placeholder="120"
                          />
                        </div>
                        <div>
                          <Label>Максимальная мощность (W)</Label>
                          <Input
                            type="number"
                            value={speakerForm.powerMax}
                            onChange={(e) => setSpeakerForm({...speakerForm, powerMax: parseInt(e.target.value) || 0})}
                            placeholder="240"
                          />
                        </div>
                        <div>
                          <Label>Сопротивление (Ω)</Label>
                          <Select value={speakerForm.impedance.toString()} onValueChange={(value) => setSpeakerForm({...speakerForm, impedance: parseInt(value)})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 Ω</SelectItem>
                              <SelectItem value="4">4 Ω</SelectItem>
                              <SelectItem value="8">8 Ω</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Частотный диапазон</Label>
                          <Input
                            value={speakerForm.frequencyResponse}
                            onChange={(e) => setSpeakerForm({...speakerForm, frequencyResponse: e.target.value})}
                            placeholder="50Hz - 20kHz"
                          />
                        </div>
                        <div>
                          <Label>Цена ($)</Label>
                          <Input
                            type="number"
                            value={speakerForm.price}
                            onChange={(e) => setSpeakerForm({...speakerForm, price: parseInt(e.target.value) || 0})}
                            placeholder="80"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={speakerForm.active}
                            onCheckedChange={(checked) => setSpeakerForm({...speakerForm, active: checked})}
                          />
                          <Label>Активно</Label>
                        </div>
                        <Button type="submit" className="w-full gradient-glow" disabled={createSpeakerMutation.isPending}>
                          {createSpeakerMutation.isPending ? "Добавление..." : "Добавить динамик"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Динамики</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {(speakers as any[]).length > 0 ? (
                          (speakers as any[]).map((speaker: any) => (
                            <div key={speaker.id} className="flex items-center justify-between py-3 border-b border-border">
                              <div className="flex-1">
                                <div className="font-medium">{speaker.brand} {speaker.model}</div>
                                <div className="text-sm text-muted-foreground">
                                  {speaker.size}мм, {speaker.powerRms}W RMS, {speaker.impedance}Ω • ${speaker.price}
                                  {speaker.active ? (
                                    <span className="ml-2 text-green-600">Активно</span>
                                  ) : (
                                    <span className="ml-2 text-red-600">Неактивно</span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteSpeakerMutation.mutate(speaker.id)}
                                disabled={deleteSpeakerMutation.isPending}
                              >
                                Удалить
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Динамики не найдены</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Amplifiers Tab */}
              <TabsContent value="amplifiers" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Добавить усилитель</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createAmplifierMutation.mutate(amplifierForm);
                      }} className="space-y-4">
                        <div>
                          <Label>Бренд</Label>
                          <Input
                            value={amplifierForm.brand}
                            onChange={(e) => setAmplifierForm({...amplifierForm, brand: e.target.value})}
                            placeholder="Alpine, Rockford Fosgate..."
                          />
                        </div>
                        <div>
                          <Label>Модель</Label>
                          <Input
                            value={amplifierForm.model}
                            onChange={(e) => setAmplifierForm({...amplifierForm, model: e.target.value})}
                            placeholder="MRV-F300"
                          />
                        </div>
                        <div>
                          <Label>Количество каналов</Label>
                          <Select value={amplifierForm.channels.toString()} onValueChange={(value) => setAmplifierForm({...amplifierForm, channels: parseInt(value)})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 канал</SelectItem>
                              <SelectItem value="2">2 канала</SelectItem>
                              <SelectItem value="4">4 канала</SelectItem>
                              <SelectItem value="5">5 каналов</SelectItem>
                              <SelectItem value="6">6 каналов</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Мощность RMS (W)</Label>
                          <Input
                            type="number"
                            value={amplifierForm.powerRms}
                            onChange={(e) => setAmplifierForm({...amplifierForm, powerRms: parseInt(e.target.value) || 0})}
                            placeholder="300"
                          />
                        </div>
                        <div>
                          <Label>Максимальная мощность (W)</Label>
                          <Input
                            type="number"
                            value={amplifierForm.powerMax}
                            onChange={(e) => setAmplifierForm({...amplifierForm, powerMax: parseInt(e.target.value) || 0})}
                            placeholder="600"
                          />
                        </div>
                        <div>
                          <Label>Сопротивление (Ω)</Label>
                          <Select value={amplifierForm.impedance.toString()} onValueChange={(value) => setAmplifierForm({...amplifierForm, impedance: parseInt(value)})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Ω</SelectItem>
                              <SelectItem value="2">2 Ω</SelectItem>
                              <SelectItem value="4">4 Ω</SelectItem>
                              <SelectItem value="8">8 Ω</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Особенности</Label>
                          <Textarea
                            value={amplifierForm.features}
                            onChange={(e) => setAmplifierForm({...amplifierForm, features: e.target.value})}
                            placeholder="Класс D, переменный HPF/LPF..."
                          />
                        </div>
                        <div>
                          <Label>Цена ($)</Label>
                          <Input
                            type="number"
                            value={amplifierForm.price}
                            onChange={(e) => setAmplifierForm({...amplifierForm, price: parseInt(e.target.value) || 0})}
                            placeholder="200"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={amplifierForm.active}
                            onCheckedChange={(checked) => setAmplifierForm({...amplifierForm, active: checked})}
                          />
                          <Label>Активно</Label>
                        </div>
                        <Button type="submit" className="w-full gradient-glow" disabled={createAmplifierMutation.isPending}>
                          {createAmplifierMutation.isPending ? "Добавление..." : "Добавить усилитель"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Усилители</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {(amplifiers as any[]).length > 0 ? (
                          (amplifiers as any[]).map((amp: any) => (
                            <div key={amp.id} className="flex items-center justify-between py-3 border-b border-border">
                              <div className="flex-1">
                                <div className="font-medium">{amp.brand} {amp.model}</div>
                                <div className="text-sm text-muted-foreground">
                                  {amp.channels}CH, {amp.powerRms}W RMS, {amp.impedance}Ω • ${amp.price}
                                  {amp.active ? (
                                    <span className="ml-2 text-green-600">Активно</span>
                                  ) : (
                                    <span className="ml-2 text-red-600">Неактивно</span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteAmplifierMutation.mutate(amp.id)}
                                disabled={deleteAmplifierMutation.isPending}
                              >
                                Удалить
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Усилители не найдены</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Subwoofers Tab */}
              <TabsContent value="subwoofers" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Добавить сабвуфер</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        createSubwooferMutation.mutate(subwooferForm);
                      }} className="space-y-4">
                        <div>
                          <Label>Бренд</Label>
                          <Input
                            value={subwooferForm.brand}
                            onChange={(e) => setSubwooferForm({...subwooferForm, brand: e.target.value})}
                            placeholder="JBL, Kicker, Alpine..."
                          />
                        </div>
                        <div>
                          <Label>Модель</Label>
                          <Input
                            value={subwooferForm.model}
                            onChange={(e) => setSubwooferForm({...subwooferForm, model: e.target.value})}
                            placeholder="GTO1214"
                          />
                        </div>
                        <div>
                          <Label>Размер (дюймы)</Label>
                          <Select value={subwooferForm.size.toString()} onValueChange={(value) => setSubwooferForm({...subwooferForm, size: parseInt(value)})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="8">8"</SelectItem>
                              <SelectItem value="10">10"</SelectItem>
                              <SelectItem value="12">12"</SelectItem>
                              <SelectItem value="15">15"</SelectItem>
                              <SelectItem value="18">18"</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Мощность RMS (W)</Label>
                          <Input
                            type="number"
                            value={subwooferForm.powerRms}
                            onChange={(e) => setSubwooferForm({...subwooferForm, powerRms: parseInt(e.target.value) || 0})}
                            placeholder="300"
                          />
                        </div>
                        <div>
                          <Label>Максимальная мощность (W)</Label>
                          <Input
                            type="number"
                            value={subwooferForm.powerMax}
                            onChange={(e) => setSubwooferForm({...subwooferForm, powerMax: parseInt(e.target.value) || 0})}
                            placeholder="1200"
                          />
                        </div>
                        <div>
                          <Label>Сопротивление (Ω)</Label>
                          <Select value={subwooferForm.impedance.toString()} onValueChange={(value) => setSubwooferForm({...subwooferForm, impedance: parseInt(value)})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Ω</SelectItem>
                              <SelectItem value="2">2 Ω</SelectItem>
                              <SelectItem value="4">4 Ω</SelectItem>
                              <SelectItem value="8">8 Ω</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Частотный диапазон</Label>
                          <Input
                            value={subwooferForm.frequencyResponse}
                            onChange={(e) => setSubwooferForm({...subwooferForm, frequencyResponse: e.target.value})}
                            placeholder="20Hz - 200Hz"
                          />
                        </div>
                        <div>
                          <Label>Рекомендуемый тип корпуса</Label>
                          <Select value={subwooferForm.recommendedBoxType} onValueChange={(value) => setSubwooferForm({...subwooferForm, recommendedBoxType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sealed">Закрытый (sealed)</SelectItem>
                              <SelectItem value="ported">Фазоинверторный (ported)</SelectItem>
                              <SelectItem value="bandpass">Бандпасс (bandpass)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Цена ($)</Label>
                          <Input
                            type="number"
                            value={subwooferForm.price}
                            onChange={(e) => setSubwooferForm({...subwooferForm, price: parseInt(e.target.value) || 0})}
                            placeholder="150"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={subwooferForm.active}
                            onCheckedChange={(checked) => setSubwooferForm({...subwooferForm, active: checked})}
                          />
                          <Label>Активно</Label>
                        </div>
                        <Button type="submit" className="w-full gradient-glow" disabled={createSubwooferMutation.isPending}>
                          {createSubwooferMutation.isPending ? "Добавление..." : "Добавить сабвуфер"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Сабвуферы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {(subwoofers as any[]).length > 0 ? (
                          (subwoofers as any[]).map((sub: any) => (
                            <div key={sub.id} className="flex items-center justify-between py-3 border-b border-border">
                              <div className="flex-1">
                                <div className="font-medium">{sub.brand} {sub.model}</div>
                                <div className="text-sm text-muted-foreground">
                                  {sub.size}", {sub.powerRms}W RMS, {sub.impedance}Ω • ${sub.price}
                                  {sub.active ? (
                                    <span className="ml-2 text-green-600">Активно</span>
                                  ) : (
                                    <span className="ml-2 text-red-600">Неактивно</span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteSubwooferMutation.mutate(sub.id)}
                                disabled={deleteSubwooferMutation.isPending}
                              >
                                Удалить
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">Сабвуферы не найдены</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
