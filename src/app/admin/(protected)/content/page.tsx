"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Flag,
  MessageSquare,
  FileText,
  Image,
  Video,
  MoreVertical,
  Eye,
  Trash2,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const ContentModeration = () => {
  const [selectedContent, _setSelectedContent] = useState(null)

  // Mock reported content
  const reportedContent = [
    {
      id: 1,
      type: "post",
      author: "John Doe",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      content: "This is a sample post that has been reported for inappropriate content...",
      reportReason: "Spam",
      reportCount: 3,
      reportedAt: "2 hours ago",
      status: "pending",
      mediaType: "text",
    },
    {
      id: 2,
      type: "article",
      author: "Jane Smith",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      content: "Article about controversial topics that may violate community guidelines...",
      reportReason: "Misinformation",
      reportCount: 7,
      reportedAt: "5 hours ago",
      status: "pending",
      mediaType: "text",
    },
    {
      id: 3,
      type: "comment",
      author: "Mike Johnson",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      content: "Offensive comment that violates our terms of service...",
      reportReason: "Harassment",
      reportCount: 12,
      reportedAt: "1 day ago",
      status: "pending",
      mediaType: "text",
    },
    {
      id: 4,
      type: "image",
      author: "Sarah Williams",
      authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      content: "Image post with potentially inappropriate content",
      reportReason: "Inappropriate Content",
      reportCount: 5,
      reportedAt: "3 days ago",
      status: "reviewed",
      mediaType: "image",
    },
  ];

  const pendingCount = reportedContent.filter(c => c.status === "pending").length;
  const reviewedCount = reportedContent.filter(c => c.status === "reviewed").length;

  const getContentIcon = (type: string) => {
    switch (type) {
      case "post": return <MessageSquare className="h-4 w-4" />;
      case "article": return <FileText className="h-4 w-4" />;
      case "comment": return <MessageSquare className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getReasonBadgeVariant = (reason: string) => {
    switch (reason) {
      case "Spam": return "secondary";
      case "Harassment": return "destructive";
      case "Misinformation": return "destructive";
      case "Inappropriate Content": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Moderation</h1>
        <p className="text-muted-foreground mt-1">
          Review and moderate reported content
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold text-foreground">23</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Content cleared</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Removed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <div className="text-2xl font-bold text-foreground">8</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Policy violations</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Auto-Flagged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold text-foreground">45</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">By AI detection</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Moderation Queue */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="reviewed">
                Reviewed ({reviewedCount})
              </TabsTrigger>
              <TabsTrigger value="auto-flagged">
                Auto-Flagged (45)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-4">
              {reportedContent
                .filter(content => content.status === "pending")
                .map((content) => (
                  <Card key={content.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={content.authorAvatar} />
                            <AvatarFallback>
                              {content.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-foreground">{content.author}</p>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                {getContentIcon(content.type)}
                                <span className="text-sm capitalize">{content.type}</span>
                              </div>
                              <Badge variant={getReasonBadgeVariant(content.reportReason)}>
                                {content.reportReason}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {content.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Flag className="h-3 w-3" />
                                {content.reportCount} reports
                              </span>
                              <span>{content.reportedAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Full Content</DropdownMenuItem>
                              <DropdownMenuItem>View User Profile</DropdownMenuItem>
                              <DropdownMenuItem>View Report Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Warn User</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="reviewed" className="space-y-4 mt-4">
              <p className="text-muted-foreground">Recently reviewed content will appear here.</p>
            </TabsContent>

            <TabsContent value="auto-flagged" className="space-y-4 mt-4">
              <p className="text-muted-foreground">Content automatically flagged by AI will appear here.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Moderation Guidelines */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Quick Moderation Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Immediate Removal</p>
                  <p className="text-sm text-muted-foreground">
                    Hate speech, explicit content, severe harassment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Review Required</p>
                  <p className="text-sm text-muted-foreground">
                    Misinformation, spam, minor policy violations
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Generally Acceptable</p>
                  <p className="text-sm text-muted-foreground">
                    Opinions, debates, professional criticism
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Protected Categories</p>
                  <p className="text-sm text-muted-foreground">
                    Political views, religious content (non-extremist)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModeration;