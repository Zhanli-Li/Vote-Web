"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AwardDisplay {
  category: string;
  name: string;
  scope?: string;
  rank?: string;
  level?: string;
}

interface ResearchDisplay {
  conferenceName?: string;
  conferenceTier?: string;
  result?: string;
  authorPosition?: string;
  direction?: string;
  title?: string;
  description?: string;
}

interface TargetSchoolDisplay {
  name?: string;
  tier: string;
  advisor?: string;
  direction?: string;
}

interface Props {
  submission: {
    id: number;
    schoolTier: string;
    schoolName: string | null;
    rank: number;
    totalStudents: number;
    awards: AwardDisplay[];
    research: ResearchDisplay[];
    otherInfo: string | null;
    targetSchools: TargetSchoolDisplay[];
  };
  children?: React.ReactNode;
}

export function SubmissionCard({ submission, children }: Props) {
  const pct = ((submission.rank / submission.totalStudents) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-sm">
            {submission.schoolTier}
          </Badge>
          {submission.schoolName && (
            <span className="text-sm text-muted-foreground">
              {submission.schoolName}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-lg font-semibold">
            排名 {submission.rank}/{submission.totalStudents}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({pct}%)
            </span>
          </p>
        </div>

        {submission.awards.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">获奖</p>
              <div className="space-y-1.5">
                {submission.awards.map((award, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm flex-wrap">
                    <Badge variant="outline" className="text-xs shrink-0">
                      {award.category}
                    </Badge>
                    <span>{award.name}</span>
                    {(award.scope || award.rank) && (
                      <span className="text-muted-foreground">
                        {[award.scope, award.rank].filter(Boolean).join(" ")}
                      </span>
                    )}
                    {award.level && (
                      <span className="text-muted-foreground">{award.level}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {submission.research.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">科研</p>
              <div className="space-y-2">
                {submission.research.map((r, i) => (
                  <div key={i} className="text-sm space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.conferenceTier && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          {r.conferenceTier}
                        </Badge>
                      )}
                      {r.result && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {r.result}
                        </Badge>
                      )}
                      {r.authorPosition && (
                        <span className="text-muted-foreground text-xs">
                          {r.authorPosition}
                        </span>
                      )}
                    </div>
                    {r.conferenceName && (
                      <p className="font-medium">{r.conferenceName}</p>
                    )}
                    {r.direction && r.direction !== "任意" && (
                      <p className="text-muted-foreground text-xs">
                        方向：{r.direction}
                      </p>
                    )}
                    {/* Legacy fields */}
                    {r.title && <span className="font-medium">{r.title}</span>}
                    {r.description && (
                      <p className="text-muted-foreground text-xs">
                        {r.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {submission.otherInfo && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-1">其他</p>
              <p className="text-sm text-muted-foreground">
                {submission.otherInfo}
              </p>
            </div>
          </>
        )}

        {submission.targetSchools.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">意向学校</p>
              <div className="space-y-1.5">
                {submission.targetSchools.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {s.tier}
                    </Badge>
                    {s.name && <span>{s.name}</span>}
                    {s.advisor && s.advisor !== "任意" && (
                      <span className="text-muted-foreground text-xs">
                        {s.advisor}
                      </span>
                    )}
                    {s.direction && s.direction !== "任意" && (
                      <span className="text-muted-foreground text-xs">
                        {s.direction}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {children}
      </CardContent>
    </Card>
  );
}
