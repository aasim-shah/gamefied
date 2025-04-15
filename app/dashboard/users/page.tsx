"use client";

import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import { getUsers, User } from "@/services/user.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [users, setUsers] = useState<User[]>([]);

  const {
    data: usersData,
    loading,
    error,
    execute: fetchUsers,
  } = useApi<User[]>(getUsers);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  const filteredUsers =
    users?.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesLevel =
        levelFilter === "all" || user.level >= parseInt(levelFilter);

      return matchesSearch && matchesStatus && matchesLevel;
    }) ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => fetchUsers()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage and monitor user accounts.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={statusFilter === "all" ? "bg-accent" : ""}
                onClick={() => setStatusFilter("all")}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                className={statusFilter === "active" ? "bg-accent" : ""}
                onClick={() => setStatusFilter("active")}
              >
                Active
              </DropdownMenuItem>
              <DropdownMenuItem
                className={statusFilter === "inactive" ? "bg-accent" : ""}
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Minimum Level</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={levelFilter === "all" ? "bg-accent" : ""}
                onClick={() => setLevelFilter("all")}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                className={levelFilter === "1" ? "bg-accent" : ""}
                onClick={() => setLevelFilter("1")}
              >
                Level 1+
              </DropdownMenuItem>
              <DropdownMenuItem
                className={levelFilter === "5" ? "bg-accent" : ""}
                onClick={() => setLevelFilter("5")}
              >
                Level 5+
              </DropdownMenuItem>
              <DropdownMenuItem
                className={levelFilter === "10" ? "bg-accent" : ""}
                onClick={() => setLevelFilter("10")}
              >
                Level 10+
              </DropdownMenuItem>
              <DropdownMenuItem
                className={levelFilter === "15" ? "bg-accent" : ""}
                onClick={() => setLevelFilter("15")}
              >
                Level 15+
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Quests Completed</TableHead>
              <TableHead>Badges</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(filteredUsers ?? []).length === 0 ? (
              <TableRow key="no-users-row">
                <TableCell colSpan={7} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              (filteredUsers ?? []).map((user, ind) => (
                <TableRow key={ind}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.level}</TableCell>
                  <TableCell>{user.quests_completed}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.badges.map((badge, index) => (
                        <Badge
                          key={`badge-${ind}-${index}`}
                          variant="secondary"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.joined_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
